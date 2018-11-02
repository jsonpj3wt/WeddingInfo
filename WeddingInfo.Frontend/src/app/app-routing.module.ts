import { Routes, RouterModule } from '@angular/router';
import { PublicPagesGuard } from './authGuard/PublicPagesGuard';
import { AuthPagesGuard } from './authGuard/AuthPagesGuard';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { RsvpComponent } from './pages/rsvp/rsvp.component';
import { ViewRsvpComponent } from './pages/view-rsvp/view-rsvp.component';
import { LoginComponent } from './pages/login/login.component';
import { ViewEventComponent } from './pages/view-event/view-event.component';
import { ViewLocationComponent } from './pages/view-location/view-location.component';
import { AdminPagesGuard } from './authGuard/AdminPagesGuard';
import { EditEventComponent } from './pages/edit-event/edit-event.component';
import { EditLocationComponent } from './pages/edit-location/edit-location.component';
import { ViewLodgingComponent } from './pages/view-lodging/view-lodging.component';
import { EditLodgingComponent } from './pages/edit-lodging/edit-lodging.component';
import { ViewRegistryComponent } from './pages/view-registry/view-registry.component';
import { EditRegistryComponent } from './pages/edit-registry/edit-registry.component';
import { S3uploadComponent } from './pages/s3upload/s3upload.component';

const routes: Routes = [
    { 
        path: '',
        component: HomeComponent
    },
    {
        path: 'rsvp',
        component: RsvpComponent
    },
    {
        path: '',
        canActivateChild: [PublicPagesGuard],
        children: [
            {
                path: 'login',
                component: LoginComponent
            }
        ]
    },
    {
        path: '',
        canActivateChild: [AuthPagesGuard],
        children: [
            {
                path: 'createEvent',
                component: EditEventComponent
            },
            {
                path: 'viewEvents',
                component: ViewEventComponent
            },
            {
                path: 'viewLocations',
                component: ViewLocationComponent
            },
            {
                path: 'viewLodgings',
                component: ViewLodgingComponent
            },
            {
                path: 'viewRegistries',
                component: ViewRegistryComponent
            },
            {
                path: 'uploads',
                component: S3uploadComponent
            }
        ]
    },
    {
        path: '',
        canActivateChild: [AdminPagesGuard],
        children: [
            {
                path: 'createLocation',
                component: EditLocationComponent
            },
            {
                path: 'createLodging',
                component: EditLodgingComponent
            },
            {
                path: 'editEvent/:id',
                component: EditEventComponent
            },
            {
                path: 'editLocation/:id',
                component: EditLocationComponent
            },
            {
                path: 'editLodging/:id',
                component: EditLodgingComponent
            },
            {
                path: 'createRegistry',
                component: EditRegistryComponent
            },
            {
                path: 'editRegistry/:id',
                component: EditRegistryComponent
            },
            {
                path: 'viewRsvp',
                component: ViewRsvpComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
