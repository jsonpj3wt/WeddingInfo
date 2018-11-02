import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthManager } from './config/AuthManager';
import { CookieModule, CookieService } from 'ngx-cookie';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AppRoutingModule } from './app-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { PublicPagesGuard } from './authGuard/PublicPagesGuard';
import { AuthPagesGuard } from './authGuard/AuthPagesGuard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MzCardModule, MzParallaxModule, MzNavbarModule, MzDropdownModule, MzValidationModule, MzInputModule, MzIconModule, MzIconMdiModule, MzButtonModule, MzSpinnerModule, MzCheckboxModule, MzModalModule, MzDatepickerModule, MzCollapsibleModule, MzTooltipModule, MzTextareaModule, MzChipModule, MzSelectModule, MzTimepickerModule, MzSidenavModule, MzMediaModule, MzTabModule } from 'ngx-materialize';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RsvpComponent } from './pages/rsvp/rsvp.component';
import { ViewEventComponent } from './pages/view-event/view-event.component';
import { ViewLocationComponent } from './pages/view-location/view-location.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { LoginComponent } from './pages/login/login.component';
import { ViewRsvpComponent } from './pages/view-rsvp/view-rsvp.component';
import { CheckboxCellComponent } from './components/checkbox-cell/checkbox-cell.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { YoutubePlayerModule } from 'ngx-youtube-player';
import { AdminPagesGuard } from './authGuard/AdminPagesGuard';
import { EditLocationComponent } from './pages/edit-location/edit-location.component';
import { EditEventComponent } from './pages/edit-event/edit-event.component';
import { EditLodgingComponent } from './pages/edit-lodging/edit-lodging.component';
import { ViewLodgingComponent } from './pages/view-lodging/view-lodging.component';
import { ViewRegistryComponent } from './pages/view-registry/view-registry.component';
import { EditRegistryComponent } from './pages/edit-registry/edit-registry.component';
import { S3uploadComponent } from './pages/s3upload/s3upload.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { EditorComponent } from './components/editor/editor.component';
import { SectionComponent } from './components/section/section.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';

@NgModule({
    declarations: [
        AppComponent,
        CheckboxCellComponent,
        EditEventComponent,
        EditLocationComponent,
        EditLodgingComponent,
        EditorComponent,
        EditRegistryComponent,
        HomeComponent,
        ImageUploaderComponent,
        LoginComponent,
        NavbarComponent,
        RsvpComponent,
        S3uploadComponent,
        SectionComponent,
        SpinnerComponent,
        ViewEventComponent,
        ViewLocationComponent,
        ViewLodgingComponent,
        ViewRegistryComponent,
        ViewRsvpComponent
    ],
    imports: [
        AgGridModule.withComponents([]),
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        CookieModule.forRoot(),
        FormsModule,
        GooglePlaceModule,
        HttpModule,
        MzButtonModule,
        MzCardModule,
        MzCheckboxModule,
        MzChipModule,
        MzCollapsibleModule,
        MzDatepickerModule,
        MzDropdownModule,
        MzIconMdiModule,
        MzIconModule,
        MzInputModule,
        MzMediaModule,
        MzModalModule,
        MzNavbarModule,
        MzParallaxModule,
        MzSelectModule,
        MzSidenavModule,
        MzSpinnerModule,
        MzTabModule,
        MzTextareaModule,
        MzTimepickerModule,
        MzTooltipModule,
        MzValidationModule,
        NgxUploaderModule,
        ScrollingModule,
        SimpleNotificationsModule.forRoot(),
        SwiperModule,
        YoutubePlayerModule
    ],
    exports: [
        NgxUploaderModule
    ],
    providers: [
        AdminPagesGuard,
        AuthManager,
        AuthPagesGuard,
        CookieService,
        PublicPagesGuard
    ],
    bootstrap: [AppComponent],
    entryComponents: [CheckboxCellComponent]
})
export class AppModule { }
