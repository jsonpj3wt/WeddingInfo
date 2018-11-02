import { Headers, Http, RequestOptionsArgs, Response, ResponseContentType } from '@angular/http';
import { Router } from "@angular/router";
import { Observable, Subject, throwError } from 'rxjs';
import { AuthManager } from "../../config/AuthManager";
import { HttpConfig } from "../../config/HttpConfig";
import { NotificationsService } from "angular2-notifications";
import { map, catchError } from 'rxjs/operators';

export class ApiTools {
    private readonly _authManager: AuthManager;
    private readonly _baseRoute: string;
    private readonly _http: Http;
    private readonly _notificationService: NotificationsService;
    private readonly _router: Router;

    constructor(
        baseRoute: string,
        authManager: AuthManager,
        http: Http,
        notificationService: NotificationsService,
        router: Router
    ) {
        this._authManager = authManager;
        this._baseRoute = baseRoute;
        this._http = http;
        this._notificationService = notificationService;
        this._router = router;
    }

    /**
     * Performs an HTTP DELETE with the specified route values.
     * @param routeValues Additional route values past the base route.
     */
    public delete(routeValues: string): Observable<any> {
        let subject: Subject<any> = new Subject<any>();
        let url: string = this.getFullUrl(routeValues);
        let headers: Headers = this.getAuthHeaders();

        this.processResponse(
            this._http.delete(url, { headers: headers }),
            subject
        );

        return subject;
    }

    /**
     * Performs an HTTP GET with the specified route values and query string parameters.
     * @param routeValues Addtional route values past the base route.
     * @param params Query string parameters to append to the request URL.
     */
    public get(routeValues: string, ...params: string[]): Observable<any> {
        return this.getVariable(routeValues, true, ...params);
    }

    /**
     * GETs raw data (such as a file) with the specified route values and query string parameters.
     * @param routeValues Addtional route values past the base route.
     * @param params Query string parameters to append to the request URL.
     */
    public getRaw(routeValues: string, ...params: string[]): Observable<any> {
        return this.getVariable(routeValues, false, ...params);
    }

    /**
     * Performs an HTTP POST with the specified route values and request body.
     * @param routeValues Addtional route values past the base route.
     * @param body The request body.
     */
    public post(routeValues: string, body: any): Observable<any> {
        let subject: Subject<any> = new Subject<any>();
        let url: string = this.getFullUrl(routeValues);
        let headers: Headers = this.getAuthHeaders();

        this.processResponse(
            this._http.post(url, body, { headers: headers }),
            subject
        );

        return subject;
    }

    /**
     * Performs an HTTP POST with the specified route values and request body.
     * @param routeValues Addtional route values past the base route.
     * @param body The request body.
     */
    public postFiles(routeValues: string, files: File[]): Observable<any> {
        let subject: Subject<any> = new Subject<any>();
        let url: string = this.getFullUrl(routeValues);
        let headers: Headers = this.getAuthHeaders();

        // DON'T SET THE Content-Type to multipart/form-data 
        // You'll get the Missing content-type boundary error
        //headers.append("Content-Type", "multipart/form-data")
        headers.append('Accept', 'application/json');

        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append(files[i].name, files[i]);
        }

        this.processResponse(
            this._http.post(url, formData, { headers: headers }),
            subject
        );

        return subject;
    }

    /**
     * Performs an HTTP PUT with the specified route values and request body.
     * @param routeValues Addtional route values past the base route.
     * @param body The request body.
     */
    public put(routeValues: string, body: any): Observable<any> {
        let subject: Subject<any> = new Subject<any>();
        let url: string = this.getFullUrl(routeValues);
        let headers: Headers = this.getAuthHeaders();

        this.processResponse(
            this._http.put(url, body, { headers: headers }),
            subject
        );

        return subject;
    }

    /**
     * Gets request headers with the active user's authorization token, if present.
     */
    private getAuthHeaders(): Headers {
        let headers: Headers = new Headers();
        if (this._authManager.authToken) {
            headers.set(this._authManager.HEADER_AUTH_KEY, "JWT " + this._authManager.authToken);
        }
        return headers;
    }

    /**
     * Gets the full URL for the request.
     * @param routeValues Addtional route values past the base route.
     */
    private getFullUrl(routeValues: string): string {
        let url: string = `${HttpConfig.BASE_URL}/${this._baseRoute}`;
        if (routeValues) {
            url += `/${routeValues}`;
        }
        return url;
    }

    /**
     * Performs an HTTP GET taking into consideration the provided option for whether or not to process the response as JSON.
     * @param routeValues Addtional route values past the base route.
     * @param params Query string parameters to append to the request URL.
     */
    private getVariable(routeValues: string, processAsJson: boolean, ...params: string[]): Observable<any> {
        let subject: Subject<any> = new Subject<any>();
        let url: string = this.getFullUrl(routeValues);
        if (params.length) {
            url += `?${params.join("&")}`;
        }

        let headers: Headers = this.getAuthHeaders();
        let options: RequestOptionsArgs = { headers: headers };
        if (!processAsJson) {
            options.responseType = ResponseContentType.Blob;
        }

        this.processResponse(
            this._http.get(url, options),
            subject,
            processAsJson
        );

        return subject;
    }

    /**
     * Processes the response from an HTTP request.
     * @param httpJob The HTTP action to process.
     * @param subject The subject to be observed by the consuming service.
     * @param json Whether or not to parse the response as JSON.
     */
    private processResponse(httpJob: Observable<Response>, subject: Subject<any>, processAsJson = true): void {
        httpJob.pipe(map((response: Response) => {
            if (response && (response.status >= 200 && response.status < 400)) {
                if (processAsJson) {
                    return response.json();
                }
                else {
                    return (response as any)._body;
                }
            }
            else {
                return throwError(response);
            }
        }), catchError((errorResponse: Response, caught: Observable<any>) => {
            let message = null;

            try {
                let responseBody = errorResponse.json();
                message = responseBody.message;

                if (errorResponse.status === 401 && responseBody.success && this._authManager.authenticated) {
                    this._notificationService.alert(message);
                    this._authManager.destroyAuth();
                    this._router.navigate(["/login"]);
                    subject.complete();
                }
            }
            catch (e) {
                message = errorResponse.statusText;
            }

            return throwError(message || "An error occurred.");
        })).subscribe((data: any) => {
            subject.next(data);
        }, (error: string) => {
            subject.error(error);
        }, () => {
            subject.complete();
        });
    }
}