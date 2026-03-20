import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MOCK_OFFICES, MockOffice } from '@app/core/constants/mock-offices';

@Component( {
  selector: 'app-offices-map',
  imports: [ GoogleMap, MapMarker, MapInfoWindow ],
  template: `
    <div class="p-4">
      <h2 class="text-2xl font-semibold mb-4">Publishing Offices</h2>
      <google-map
        width="100%"
        height="600px"
        [center]="center"
        [zoom]="zoom"
      >
        @for (office of offices; track office.name) {
          <map-marker
            #marker="mapMarker"
            [position]="{ lat: office.lat, lng: office.lng }"
            [title]="office.name"
            (mapClick)="openInfo(marker, office)"
          />
        }
        <map-info-window #infoWindow>
          @if (selectedOffice()) {
            <div class="p-1">
              <p class="font-semibold">{{ selectedOffice()!.name }}</p>
              <p class="text-sm text-gray-600">{{ selectedOffice()!.address }}</p>
            </div>
          }
        </map-info-window>
      </google-map>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class OfficesMap {
  protected readonly offices = MOCK_OFFICES;
  protected readonly center: google.maps.LatLngLiteral = { lat: 30, lng: 10 };
  protected readonly zoom = 2;
  protected readonly selectedOffice = signal<MockOffice | null>( null );

  #infoWindow = viewChild.required<MapInfoWindow>( 'infoWindow' );

  protected openInfo( marker: MapMarker, office: MockOffice ): void {
    this.selectedOffice.set( office );
    this.#infoWindow().open( marker );
  }
}
