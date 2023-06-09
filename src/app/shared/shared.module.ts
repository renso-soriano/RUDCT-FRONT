import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { ClickOutsideModule } from 'ng-click-outside';

import { AutocompleteModule } from './components/autocomplete/autocomplete.module';
import { PipeModule } from 'app/shared/pipes/pipe.module';

//COMPONENTS
import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { HorizontalMenuComponent } from './horizontal-menu/horizontal-menu.component';
import { VerticalMenuComponent } from "./vertical-menu/vertical-menu.component";
import { CustomizerComponent } from './customizer/customizer.component';
import { NotificationSidebarComponent } from './notification-sidebar/notification-sidebar.component';

//DIRECTIVES
import { ToggleFullscreenDirective } from "./directives/toggle-fullscreen.directive";
import { SidebarLinkDirective } from './directives/sidebar-link.directive';
import { SidebarDropdownDirective } from './directives/sidebar-dropdown.directive';
import { SidebarAnchorToggleDirective } from './directives/sidebar-anchor-toggle.directive';
import { SidebarDirective } from './directives/sidebar.directive';
import { TopMenuDirective } from './directives/topmenu.directive';
import { TopMenuLinkDirective } from './directives/topmenu-link.directive';
import { TopMenuDropdownDirective } from './directives/topmenu-dropdown.directive';
import { TopMenuAnchorToggleDirective } from './directives/topmenu-anchor-toggle.directive';
import { DataFilterComponent } from './components/data-filter/data-filter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MapaComponent } from './components/mapa/mapa.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import{LeafletModule} from '@asymmetrik/ngx-leaflet'
import { RegionChartComponent } from './components/region-chart/region-chart.component';
import { ChartistModule } from 'ng-chartist';
import { MatchHeightModule } from './directives/match-height.directive';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AngularResizedEventModule } from 'angular-resize-event';
import { RandyFileComponent } from './components/randy-file/randy-file.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
    exports: [
        CommonModule,
        FooterComponent,
        NavbarComponent,
        VerticalMenuComponent,
        HorizontalMenuComponent,
        CustomizerComponent,
        NotificationSidebarComponent,
        ToggleFullscreenDirective,
        SidebarDirective,
        TopMenuDirective,
        NgbModule,
        TranslateModule,
        DataFilterComponent,
        MapaComponent,
        LeafletModule,
        RandyFileComponent,
        ModalComponent,
        RegionChartComponent,
    ],
    imports: [
        RouterModule,
        CommonModule,
        NgbModule,
        TranslateModule,
        FormsModule,
        OverlayModule,
        ReactiveFormsModule,
        PerfectScrollbarModule,
        ClickOutsideModule,
        AutocompleteModule,
        PipeModule,
        NgSelectModule,
        NgxSpinnerModule,
        LeafletModule,
        CommonModule,
        ChartistModule,
        NgbModule,
        MatchHeightModule,
        NgApexchartsModule,
        AngularResizedEventModule,
        FileUploadModule
        // RandyFileComponent,

    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        VerticalMenuComponent,
        HorizontalMenuComponent,
        CustomizerComponent,
        NotificationSidebarComponent,
        ToggleFullscreenDirective,
        SidebarLinkDirective,
        SidebarDropdownDirective,
        SidebarAnchorToggleDirective,
        SidebarDirective,
        TopMenuLinkDirective,
        TopMenuDropdownDirective,
        TopMenuAnchorToggleDirective,
        TopMenuDirective,
        DataFilterComponent,
        MapaComponent,
        RandyFileComponent,
        ModalComponent,
        RegionChartComponent,
    ],
    providers: [DecimalPipe],
})
export class SharedModule { }
