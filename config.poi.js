var baseLayerConfiguration = [
  {
    service:"http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?",
    name:"naturalearth2",
    title:"World base layer Natural Earth ",
    enabled: true,
    format:"image/gif"
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?",
    name:"streetmap",
    title:"Open streetmap",
    enabled: false,
    format:"image/png"
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/MODIS_Netherlands.cgi?",
    name:"modis_250m_netherlands_8bit",
    title:"Static Modis image of the Netherlands",
    enabled: false,
    format:"image/png"
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
    name:"ne_10m_admin_0_countries_simplified",
    format:"image/png",
    title:"World country borders",
    enabled: true,
    keepOnTop:true
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
    name:"grid1x1",
    format:"image/png",
    title:"Grid 1x1 degrees",
    enabled: false,
    keepOnTop:true
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
    name:"grid2x2",
    format:"image/png",
    title:"Grid 2x2 degrees",
    enabled: false,
    keepOnTop:true
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
    name:"grid5x5",
    format:"image/png",
    title:"Grid 5x5 degrees",
    enabled: false,
    keepOnTop:true
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
    name:"grid10x10",
    format:"image/png",
    title:"Grid 10x10 degrees",
    enabled: false,
    keepOnTop:true
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
    name:"nl_raster_latlon",
    format:"image/png",
    title:"KNMI baselayer of the Netherlands",
    enabled: false,
    keepOnTop:false
  },{
    service:"http://geoservices.knmi.nl/cgi-bin/worldmaps.cgi?",
    name:"world_country_names",
    format:"image/png",
    title:"Country names",
    enabled: false,
    keepOnTop:true
  }
];

var defaultProjection = {srs:'EPSG:4326',bbox:'-180,-90,180,90'};

var defaultLanguage = { language: 'nl' };

/* Username for the GeoNames API */
var defaultUsernameSearch = "adaguc";

/* URL for the search GeoNames API request */
var geoNamesURL = "http://api.geonames.org/search?q={searchTerm}&username={username}&maxRows=1";

/* The URL with the CGI file for connecting to the SQLite DB */
var knmiGeoNamesURL = "http://bhw494.knmi.nl/~tjalma/knmi_geonames.cgi?q={searchTerm}";

/* URL for creating/updating/deleting flags */
var knmiFlagURL = "http://localhost/cgi-bin/knmi_point_interest.cgi?";

/* URL for getting the information about the points of interest NetCDF file. */
/* pointInterestFileName is the name for the source file. */
var knmiGetPointsOfInterestURL = "http://localhost/cgi-bin/adaguc.poi.cgi?";
var pointInterestFileName = "ncpoifile";

var hashLocationNotfiyAddLayer = true;

var getFeatureInfoApplications = [
  {name:'Time series mode',iconCls:'button_getfeatureinfo',location:'apps/gfiapp_d3c3.html'},
  {name:'Points of interest',iconCls:'button_pointinterest',location:'apps/gfiapp_point_interest.html'}
];

var dataChooserConfiguration = [
  {
    title:'GeoJSON example',
    thumbnail:'https://climate4impact.eu/impactportal/adagucserver?%26source%3Dhttp:%2F%2Fopendap%2Eknmi%2Enl%2Fknmi%2Fthredds%2FdodsC%2FCLIPC%2Fstoryline_urbanheat%2Fgeojson%2FNUTS_2010_L3%2Egeojson%2Enc&SERVICE=WMS&&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=baselayer,features&WIDTH=1585&HEIGHT=1014&CRS=EPSG%3A4326&BBOX=14.519189602377757,-33.831495175913055,79.56529559419118,67.84313795724697&STYLES=auto%2Fnearest&FORMAT=image/png&TRANSPARENT=TRUE&',
    service:'https://climate4impact.eu/impactportal/adagucserver?source=http%3A%2F%2Fopendap.knmi.nl%2Fknmi%2Fthredds%2FdodsC%2FCLIPC%2Fstoryline_urbanheat%2Fgeojson%2FNUTS_2010_L3.geojson.nc&service=WMS&request=GetCapabilities',
    layer:'features',
    opacity:0.5
  },{
    title:'Points of Interest',
    thumbnail:knmiGetPointsOfInterestURL + 'source%3D' + pointInterestFileName + '.nc&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=baselayer,name&WIDTH=300&HEIGHT=200&CRS=EPSG%3A4326&STYLES=auto%2Fpoint&FORMAT=image/png&BBOX=-90,-180,90,180',
    service:knmiGetPointsOfInterestURL + 'source%3D' + pointInterestFileName + '.nc&service=WMS&request=GetCapabilities',
    layer:'name'
  },{
    title:'KNMI realtime precipitation radar',
    thumbnail:'webmapjs/img/knmi_radar_icon.png',
    service:'http://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?',
    layer:'RADNL_OPER_R___25PCPRR_L3_COLOR',
    srs:'EPSG:3857',
    bbox:'220000,6500000,1000000,7200000',
    baselayerservice:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',
    baselayername:'streetmap',
    opacity:0.5
  },{
    title:'MSGCPP last 7 days',
    thumbnail:'webmapjs/img/750px-MSG-CPP_Screenshot-Google_Earth-cwp.png',
    service:'http://msgcpp-ogc-realtime.knmi.nl/msgrt.cgi?',
    layer:'atmosphere_optical_thickness_due_to_cloud'
  },{
    title:'MSGCPP archive',
    thumbnail:'webmapjs/img/750px-MSG-CPP_Screenshot-Google_Earth-cwp.png',
    service:'http://msgcpp-ogc-archive.knmi.nl/msgar.cgi?',
    layer:'atmosphere_optical_thickness_due_to_cloud'
  },/*{
    title:'OMI daily SO2',
    thumbnail:'http://adaguc.knmi.nl/contents/webservices/OMI_TDCSO2_L3.jpg',
    service:'http://geoservices.knmi.nl/cgi-bin/OMI___OPER_R___TDCSO2__L3.cgi?',
    layer:'OMI_L3_TDCSO2',
    srs:'EPSG:4326',
    bbox:'-180,-90,180,90'
  },*/{
    title:'OMI yearly NO2',
    thumbnail:'webmapjs/img/OMI_NO2_TYTRCNO_screenshot.png',
    service:'http://geoservices.knmi.nl/cgi-bin/OMI___OPER_R___TYTRCNO_L3.cgi?',
    layer:'omi_yearly_tropospheric_no2',
    srs:'EPSG:4326',
    bbox:'-180,-90,180,90'
  },{
    title:'Geoserver @ suite.opengeo.org',
    thumbnail:'http://suite.opengeo.org/geoserver/wms?service=WMS&version=1.3.0&request=GetMap&layers=usa:states&srs=EPSG:4326&bbox=24.956,-124.731,49.372,-66.97&format=image/png&width=780&height=330',
    service:'http://suite.opengeo.org/geoserver/wms?',
    layer:'usa:states'
  }
  
  
  
];

var mapTypeConfiguration = [ 
  { 
    title: 'World WGS84', 
    bbox: [-180,-90,180,90], 
    srs: 'EPSG:4326',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  },/*{ 
    title: 'Mollweide (7399)', 
    bbox: [-18157572.744146045,-11212941.682924412,18085661.018022258,11419683.192411266],
    srs: 'EPSG:7399',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  },*/
  { 
    title: 'Robinson', 
    bbox: [-17036744.451383516,-10711364.114367772,16912038.081015453,10488456.659686875],
    srs: 'EPSG:54030',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  },{ 
    title: 'World Mercator', 
    bbox: [-19000000,-19000000,19000000,19000000],
    srs: 'EPSG:3857',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  },{ 
    title: 'Openstreetmap', 
    bbox: [-19000000,-19000000,19000000,19000000],   
    srs: 'EPSG:3857', 
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'streetmap'}
  },{ 
    title: 'Northern Hemisphere', 
    bbox: [-5661541.927991125,-3634073.745615984,5795287.923063262,2679445.334384017],
    srs: 'EPSG:3411',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  },{ 
    title: 'Southern Hemisphere', 
    bbox: [-4589984.273212382,-2752857.546211313,5425154.657417289,2986705.2537886878],
    srs: 'EPSG:3412',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  },{ 
    title: 'Europe North Pole', 
    bbox: [-13000000,-13000000,13000000,13000000],
    srs: 'EPSG:3575',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  },
  
  
  
 
  
  { 
    title: 'Europe stereographic', 
    bbox: [-2776118.977564746,-6499490.259201691,9187990.785775745,971675.53185069], 
    srs: 'EPSG:32661',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  }, { 
    title: 'North America', 
    bbox: [-2015360.8716608454,-697107.5349683464,9961718.159421016,6782157.107682772],
    srs: 'EPSG:50001',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  },
  
  { 
    title: 'Openstreetmap NL', 
    bbox: [220000,6500000,1000000,7200000],   
    srs: 'EPSG:3857', 
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'streetmap'}
  }/*,{ 
    title: 'The Netherlands (28992)', 
    bbox: [-350000,125000,700000,900000 ],
    srs: 'EPSG:28992',
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'naturalearth2'}
  },*//*{ 
    title: 'PDOK BRT NL', 
    bbox: [-350000,125000,700000,900000],   
    srs: 'EPSG:28992', 
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'streetmap'}
  },*//*{ 
    title: 'Openstreetmap Schiphol', 
    bbox: [515813.2988839851,6850485.5537392385,544160.8241851525,6869318.449956324],   
    srs: 'EPSG:3857', 
    baselayer:{service:'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',name:'streetmap'}
  }*/
  
  /*,{ 
    title: 'Schiphol Satellite + Aerial Mercator', 
    bbox: [522402.16196646384,6852917.910540686,537831.8792436487,6863959.075064662],
    srs: 'EPSG:3857',
    baselayer:{service:'http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?',name:'satellite'}
  },{ 
    title: 'Topographic Mercator in NL', 
    bbox: [220000,6500000,1000000,7200000],
    srs: 'EPSG:3857',
    baselayer:{service:'http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?',name:'topo'}
  },{ 
    title: 'Canvas Mercator in NL', 
    bbox: [220000,6500000,1000000,7200000],
    srs: 'EPSG:3857',
    baselayer:{service:'http://birdexp03.knmi.nl/cgi-bin/plieger/wmst.cgi?',name:'canvas'}
  }*/
];

    
      
//FOR JSP:

// var scaleBarURL        = "http://euro4mvis.knmi.nl/adagucviewer/webmapjs/php/makeScaleBar.php?";
// var xml2jsonrequestURL = "/impactportal/AdagucViewer?SERVICE=XML2JSON&";
// var requestProxy = "/impactportal/AdagucViewer?SERVICE=PROXY&";


//For PHP:
var scaleBarURL        = "http://euro4mvis.knmi.nl/adagucviewer/webmapjs/php/makeScaleBar.php?";
var requestProxy       = "./webmapjs/php/MakeRequest.php?";
var xml2jsonrequestURL = "./webmapjs/php/xml2jsonrequest.php?"
