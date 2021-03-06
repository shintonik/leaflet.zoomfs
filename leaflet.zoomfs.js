/*
 * L.Control.ZoomFS - default Leaflet.Zoom control with an added fullscreen button
 * built to work with Leaflet version 0.3
 * https://github.com/elidupuis/leaflet.zoomfs
 */
L.Control.ZoomFS = L.Control.Zoom.extend({
  includes: L.Mixin.Events,
  onAdd: function (map) {
		this._map = map;
		this._isFullscreen = false;
		this._container = L.DomUtil.create('div', 'leaflet-control-zoom');

		this._zoomInButton = this._createButton(
				'Zoom in', 'leaflet-control-zoom-in', this._map.zoomIn, this._map);
		this._zoomOutButton = this._createButton(
				'Zoom out', 'leaflet-control-zoom-out', this._map.zoomOut, this._map);
    // ideally the fullscreen function should reside in the Map class, but this will do for now...
    this._fullScreenButton = this._createButton(
				'Full Screen', 'leaflet-control-fullscreen', this.fullscreen, this);

    // reorder this as you like (ie: place fullscreen button below zoom buttons)
		this._container.appendChild(this._fullScreenButton);
		this._container.appendChild(this._zoomInButton);
		this._container.appendChild(this._zoomOutButton);

	},
  fullscreen: function(){
    // call appropriate internal function
	  if (!this._isFullscreen) {
	    this._enterFullScreen();
	  }else{
	    this._exitFullScreen();
	  };

    // force internal resize
	  this._map.invalidateSize();
  },
  _enterFullScreen: function(){
    var container = this._map._container;

    // apply our fullscreen settings
    container.style.position = 'fixed';
		container.style.left = 0;
		container.style.top = 0;
		container.style.width = '100%';
		container.style.height = '100%';

    // store state
    L.DomUtil.addClass(container, 'leaflet-fullscreen');
	  this._isFullscreen = true;

	  // add ESC listener
	  L.DomEvent.addListener(document, 'keyup', this._onKeyUp, this);
	  
    // fire fullscreen event on map
    this._map.fire('enterFullscreen');
  },
  _exitFullScreen: function(){
    var container = this._map._container;

    // update state
    L.DomUtil.removeClass(container, 'leaflet-fullscreen');
    this._isFullscreen = false;

    // remove fullscreen style; make sure we're still position relative for Leaflet core.
    container.removeAttribute('style');
    
    // re-apply position:relative; if user does not have it.
    var position = L.DomUtil.getStyle(container, 'position');
    if (position !== 'absolute' && position !== 'relative') {
     container.style.position = 'relative';
    }

    // remove ESC listener
	  L.DomEvent.removeListener(document, 'keyup', this._onKeyUp);

    // fire fullscreen event
    this._map.fire('exitFullscreen');
  },
  _onKeyUp: function(e){
    if (!e) var e = window.event;
    if (e.keyCode === 27 && this._isFullscreen === true) {
      this._exitFullScreen();
    }
  }
});