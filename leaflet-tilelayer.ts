import { customElement, property, PropertyValues } from 'lit-element';
import { LeafletILayerMixin } from './mixins/ilayer';
import { LeafletTileLayerMixin } from './mixins/tile-layer';
import * as L from 'leaflet';
import { LeafletBase } from './base';
import { DATA_ELEMENT_STYLES } from './data-element.css';

/**
 * Element which defines a [tile layer](http://leafletjs.com/reference.html#tilelayer).
 *
 * @example
 * ```html
 *
 *    <leaflet-tilelayer
 *        url="https://stendhalgame.org/map/3/{z}-{x}-{y}.png"
 *        minzoom="2" maxzoom="6" nowrap>
 *
 *            Map source: <a href="https://stendhalgame.org">Stendhal MMORPG</a>
 *
 *    </leaflet-tilelayer>
 * ```
 * @element leaflet-tilelayer
 * @blurb element which defines a tile layer. The content of the leaflet-tilelayer is used as attribution.
 * @demo https://leaflet-extras.github.io/leaflet-map/demo.html
 * @homepage https://leaflet-extras.github.io/leaflet-map/
 */
@customElement('leaflet-tilelayer')
export class LeafletTileLayer extends LeafletILayerMixin(
  LeafletTileLayerMixin(LeafletBase)
) {
  static readonly is = 'leaflet-tilelayer';

  static readonly styles = DATA_ELEMENT_STYLES;

  layer: L.TileLayer;

  @property() url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  get cleanedUrl() {
    return this.url.replace(/%7B([sxyz])%7D/g, '{$1}');
  }

  updated(changed: PropertyValues) {
    super.updated?.(changed);
    if (changed.has('url')) this.urlChanged();
  }

  get container() {
    return this._container;
  }

  set container(v) {
    this._container = v;
    if (!this.container) return;

    this.layer = L.tileLayer(this.cleanedUrl, {
      attribution: this.innerHTML + this.attribution,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      maxNativeZoom: this.maxNativeZoom,
      tileSize: this.tileSize,
      subdomains: this.subdomains,
      errorTileUrl: this.errorTileUrl,
      tms: this.tms,
      noWrap: this.noWrap,
      zoomOffset: this.zoomOffset,
      zoomReverse: this.zoomReverse,
      opacity: this.opacity,
      zIndex: this.zIndex,
      detectRetina: this.detectRetina,
    });

    // forward events
    this.layer.on(
      'loading load tileloadstart tileload tileunload',
      this.onLeafletEvent
    );

    this.layer.addTo(this.container);
  }

  urlChanged() {
    if (!this.layer) return;
    this.layer.setUrl(this.cleanedUrl);
  }
}
