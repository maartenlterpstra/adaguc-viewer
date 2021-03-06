/**
  * WMJSDimension Class
  * Keep all information for a single dimension, like time.
  * Author : MaartenPlieger (plieger at knmi.nl)
   * Copyright KNMI
  */
WMJSDateOutSideRange = 'outside range';
WMJSDateTooEarlyString = 'date too early';
WMJSDateTooLateString = 'date too late';
function WMJSDimension (config) {
  this.name = undefined;          // Name of the dimension, e.g. 'time'
  this.units = undefined;         // Units of the dimension, e.g. 'ISO8601'
  this.values = undefined;        // Values of the dimension, according to values defined in WMS specification, e.g. 2011-01-01T00:00:00Z/2012-01-01T00:00:00Z/P1M or list of values.
  this.currentValue = undefined;  // The current value of the dimension, changed by setValue and read by getValue
  this.defaultValue = undefined;
  this.parentLayer = undefined;
  this.timeRangeDuration = undefined;
  this.linked = true;

  this.generateAllValues = () => {
    const vals = [];
    if (this.size() > 5000) {
      throw "Error: Dimension too large to query all possible values at once";
    }
    for (let i = 0; i < this.size(); i++) {
      vals.push(this.getValueForIndex(i));
    }
    return vals;
  }

  var _this = this;
  if (isDefined(config)) {
    if (isDefined(config.name)) { this.name = config.name; }
    if (isDefined(config.units)) { this.units = config.units; }
    if (isDefined(config.values)) { this.values = config.values; }
    if (isDefined(config.currentValue)) { this.currentValue = config.currentValue; }
    if (isDefined(config.defaultValue)) { this.defaultValue = config.defaultValue; }
    if (isDefined(config.parentLayer)) { this.parentLayer = config.parentLayer; }
    if (isDefined(config.linked)) { this.linked = config.linked; }
  }

  var initialized = false;
  var timeRangeDurationDate;  // Used for timerange (start/stop/res)
  var allDates = [];          // Used for individual timevalues
  var type;                   // Can be 'timestartstopres', 'timevalues' or 'anyvalue'
  var allValues = [];
  
  /* This function set the first value of the dimension to given value
   * This is useful when a reference_time is used in combination with time.
   * By default the time values prior to the reference_time will not give valid results.
   * This function can be used to remove the first time values from the dimension by setting the start date 
   * a bit later in time
   */
  this.setStartTime = function(val) {
//     console.log('setStartTime', val);
    if(!initialized){
      initialize(this);
    }
//     console.log('set start time', val);
    if (!val || val.length === 0) {
      _this.reInitializeValues(_this.values);
      timeDim.setClosestValue(true);
      console.log('returning');
      return;
    }
    

    val = parseISO8601DateToDate(val).toISO8601();
//     console.log('type = ' + type);
//     console.log('setStartTime', val);
    if (type === 'timestartstopres'){
      let v = _this.values;
      /* Adjust the first value for start/stop/res */
      let newValue = val + v.substring(v.indexOf("/"));
//       console.log(newValue);
      _this.reInitializeValues(newValue);
      _this.setClosestValue();
      return;
    } else if (type === 'timevalues'){
      /* Filter all dates from the array which are lower than given start value */
      let newValue = parseISO8601DateToDate(val);
      var new_arr = arr.filter(function(x) {
        return allDates[j] >= newValue;
      });
      var newValues = '';
      for (var j=0;j<new_arr.length;j++){
        if (j > 0) newValues += '/';
        newValues += new_arr[j].toISO8601();
      }
      _this.reInitializeValues(newValues);
      _this.setClosestValue();
      return;
    }
  };

  _this.reInitializeValues = function(values){
    initialized = false;
    initialize(_this, values);
  }
  
  var initialize = function (_this, forceothervalues) {
    if (initialized == true) return;
    let ogcdimvalues = _this.values;
    if (forceothervalues){
      ogcdimvalues = forceothervalues;
    }
    if (!isDefined(ogcdimvalues)) return;
    allValues = [];
    initialized = true;
    if (_this.units == 'ISO8601') {
      if (ogcdimvalues.indexOf('/') > 0) {
        type = 'timestartstopres';
        timeRangeDurationDate = new parseISOTimeRangeDuration(ogcdimvalues);
        
//         console.log('timeRangeDurationDate size = ',timeRangeDurationDate.getTimeSteps());
        // alert(timeRangeDurationDate.getTimeSteps()+" - "+ogcdimvalues);
      } else {
        // TODO Parse 2007-03-27T00:00:00.000Z/2007-03-31T00:00:00.000Z/PT1H,2007-04-07T00:00:00.000Z/2007-04-11T00:00:00.000Z/PT1H
        type = 'timevalues';
      }
    } else {
      type = 'anyvalue';
      _this.linked = false;
    }
    if (type != 'timestartstopres') {
      var values = ogcdimvalues.split(',');
      for (var j = 0; j < values.length; j++) {
        var valuesRanged = values[j].split('/');
        if (valuesRanged.length == 3) {
          var start = parseFloat(valuesRanged[0]);
          var stop = parseFloat(valuesRanged[1]);
          var res = parseFloat(valuesRanged[2]);
          stop += res;
          if (start > stop)stop = start;
          if (res <= 0)res = 1;
          for (var j = start; j < stop; j = j + res) {
            allValues.push(j);
          }
        } else {
          allValues.push(values[j]);
        }
      }

      if (type == 'timevalues') {
        for (var j = 0; j < allValues.length; j++) {
          allDates[j] = parseISO8601DateToDate(allValues[j]);
        }
      }
    }

    if (!isDefined(_this.defaultValue)) {
      _this.defaultValue = _this.getValueForIndex(0);
    }
    if (!isDefined(_this.currentValue)) {
      _this.currentValue = _this.getValueForIndex(0);
    }
    
    _this.dimMinValue = _this.getValueForIndex(0);
    _this.dimMaxValue = _this.getValueForIndex(_this.size() - 1);
  };

  /**
    * Returns the current value of this dimensions
    */
  this.getValue = function () {
    if(!initialized){
      initialize(_this);
    }
    let value = _this.defaultValue;
    if (isDefined(_this.currentValue)) {
      value =  _this.currentValue;
    }
    value = _this.addTimeRangeDurationToValue(value);
    return value;
  };

  /**
    * Set current value of this dimension
    */
  this.setValue = function (value) {
    if(!initialized){
      initialize(_this);
    }
    
    if (value == WMJSDateOutSideRange || value == WMJSDateTooEarlyString || value == WMJSDateTooLateString) {
      return;
    }
    _this.currentValue = value;  
  };

  this.setClosestValue = function (newValue, evenWhenOutsideRange) {
    if(!newValue){
      newValue = this.getValue();
      evenWhenOutsideRange = true;
    }
    this.currentValue = this.getClosestValue(newValue, evenWhenOutsideRange);
  };

  this.getNextClosestValue = function (newValue) {
    var closestValue = this.getClosestValue(newValue);
    var index = this.getIndexForValue(closestValue);
    var nextValue = this.getValueForIndex(index + 1);
    // Only return future dates
    if (!nextValue || nextValue === 'date too early' || moment(newValue) >= moment(nextValue)) {
      return null;
    }
    return nextValue;
  };
  

  this.addTimeRangeDurationToValue = function(value) {
    if (value == WMJSDateOutSideRange ||
      value == WMJSDateTooEarlyString ||
      value == WMJSDateTooLateString) {
      return value;
    }
    if(_this.timeRangeDuration && _this.timeRangeDuration.length > 0) {
      let interval = parseISO8601IntervalToDateInterval(_this.timeRangeDuration);
      let value2date=parseISO8601DateToDate(value);
      value2date.add(interval);
      let value2 = value2date.toISO8601();
      return value + "/" + value2;
    }
    return value;
  }
  
  
  this.setTimeRangeDuration = function(duration) {
    _this.timeRangeDuration = duration;
    if(duration && duration.length > 0) {
      _this.reInitializeValues(_this.values);
      let startDate = parseISO8601DateToDate(_this.dimMinValue);
      let stopDate = (_this.dimMaxValue);   
      let interval = parseISO8601IntervalToDateInterval(_this.timeRangeDuration);
      if(interval.second!=0) startDate.setUTCSeconds(0);
      if(interval.minute!=0) {startDate.setUTCSeconds(0);startDate.setUTCMinutes(0);}
      if(interval.hour!=0) {startDate.setUTCSeconds(0);startDate.setUTCMinutes(0);startDate.setUTCSHours(0);}
      if(interval.day!=0) {startDate.setUTCSeconds(0);startDate.setUTCMinutes(0);startDate.setUTCSHours(0);startDate.setUTCDate(0);}
      if(interval.month!=0) {startDate.setUTCSeconds(0);startDate.setUTCMinutes(0);startDate.setUTCSHours(0);startDate.setUTCDate(0);}
      
      _this.reInitializeValues(startDate.toISO8601() +'/'+stopDate+'/'+ _this.timeRangeDuration);
    } else {     
      console.log('reset');
      _this.reInitializeValues(_this.values);
    }
  };
  
  
      
  this.getClosestValue = function (newValue, evenWhenOutsideRange) {
  
    if(newValue && newValue.indexOf("/")!=-1){
      newValue = newValue.split("/")[0];
    }
    evenWhenOutsideRange = typeof evenWhenOutsideRange !== 'undefined' ? evenWhenOutsideRange : false;
    var index = -1;
    var _value = WMJSDateOutSideRange;
    try {
      index = this.getIndexForValue(newValue);

      _value = this.getValueForIndex(index);
    } catch (e) {
      if (typeof (e) === 'number') {
        if (e == 0)_value = WMJSDateTooEarlyString; else _value = WMJSDateTooLateString;
      }
    }

    if (newValue == 'current' || newValue == 'default' || newValue == '') {
      _value = this.defaultValue;
    } else if (newValue == 'latest' || (evenWhenOutsideRange && _value === WMJSDateTooLateString)) {
      _value = this.getValueForIndex(this.size() - 1);
    } else if (newValue == 'earliest' || (evenWhenOutsideRange && _value === WMJSDateTooEarlyString)) {
      _value = this.getValueForIndex(0);
    } else if (newValue == 'middle') {
      var middleIndex = (this.size() / 2) - 1;
      if (middleIndex < 0) middleIndex = 0;
      _value = this.getValueForIndex(middleIndex);
    }
    // alert(_value);
    return _value;
  };

  /**
    * Get dimension value for specified index
    */
  this.getValueForIndex = function (index) {
    initialize(this);
    if (index < 0) {
      if (index == -1) {
        return WMJSDateTooEarlyString;
      }
      if (index == -2) {
        return WMJSDateTooLateString;
      }
      return -1;
    }
    if (type == 'timestartstopres') {
      try {
        return timeRangeDurationDate.getDateAtTimeStep(index).toISO8601();
      } catch (e) {}
      return timeRangeDurationDate.getDateAtTimeStep(index);
    }
    if (type == 'timevalues') return allValues[index];
    if (type == 'anyvalue') return allValues[index];
  };

  /**
    * same as getValueForIndex
    */
  this.get = function (index) {
    return this.getValueForIndex(index);
  };

  /**
    * Get index value for specified value. Returns the index in the store for the given time value, either a date or a iso8601 string can be passes as input.
    * @param value Either a JS Date object or an ISO8601 String

    * @return The index of the value.  If outSideOfRangeFlag is false, a valid index will always be returned. If outSideOfRangeFlag is true: -1 if the index is not in the store, but is lower than available values, -2 if the index is not in store, but is higher than available values
    */
  this.getIndexForValue = function (value, outSideOfRangeFlag) {
    initialize(this);
    if (!isDefined(outSideOfRangeFlag))outSideOfRangeFlag = true;
    if (typeof (value) === 'string') {
      if (value == 'current' && this.defaultValue != 'current') {
        return this.getIndexForValue(this.defaultValue);
      }
    }
    // {
    //   const v = value;
    //   try{
    //     console.log("getIndexForValue" + v + 'type'+type);
    //   }catch(e){

    //   }
    // }
    if (type == 'timestartstopres') {
      try {
        if (typeof (value) === 'string') {
          return timeRangeDurationDate.getTimeStepFromISODate(value, outSideOfRangeFlag);
        }
        return timeRangeDurationDate.getTimeStepFromDate(value, outSideOfRangeFlag);
      } catch (e) {
        // error("WMSJDimension::getIndexForValue,1: "+e);
        if (parseInt(e) == 0) return -1; else return -2;
      }
    }
    if (type == 'timevalues') {
      try {
        var dateToFind = parseISO8601DateToDate(value).getTime();
        var minDistance;
        var foundIndex = 0;
        for (var j = 0; j < allValues.length; j++) {
          var distance = (allDates[j].getTime() - dateToFind);
          if (distance < 0)distance = -distance;
          // debug(j+" = "+distance+" via "+allDates[j].getTime()+" and "+dateToFind);
          if (j == 0)minDistance = distance;
          if (distance < minDistance) {
            minDistance = distance;
            foundIndex = j;
          }
        }
        return foundIndex;
      } catch (e) {
        error('WMSJDimension::getIndexForValue,2: ' + e);
        return -1;
      }

      /* var dateToFind = parseISO8601DateToDate(value).getTime();
      allValues[j]
      var max = allValues.length-1;
      var min = 0;

      var average = parseInt((max-min)/2); */
    }

    if (type == 'anyvalue') {
      for (var j = 0; j < allValues.length; j++) {
        if (allValues[j] == value) return j;
      }
    }

    return -1;
  };

  /**
    * Get number of values
    */
  this.size = function () {
    initialize(this);
    if (type == 'timestartstopres') return timeRangeDurationDate.getTimeSteps();
    if (type == 'timevalues' || type == 'anyvalue') {
      return allValues.length;
    }
  };

  /**
   * Clone this dimension
   */
  this.clone = function () {
    var dim = new WMJSDimension();
    dim.name = _this.name;
    dim.units = _this.units;
    dim.values = _this.values;
    dim.initialize();
    dim.currentValue = _this.currentValue;
    dim.defaultValue = _this.defaultValue;
    dim.parentLayer = _this.parentLayer;
    dim.linked = _this.linked;
    
    
    return dim;
  };
  // initialize(this);
  
  this.initialize = function () {
    initialize(this);
  };
};
