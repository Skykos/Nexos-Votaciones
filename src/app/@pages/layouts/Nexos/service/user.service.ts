import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationRestService } from './configuration.rest.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient,
    private config: ConfigurationRestService
    ) { }

  updateCustomerDetails(customer_id, nameRegister, documentRegister) {
    var formData = new FormData;
    formData.append('key', this.config.key);
    formData.append('id', customer_id)
    formData.append('nameRegister', nameRegister);
    formData.append('documentRegister', documentRegister);
    formData.append('present', '0');
    this.httpClient.post(this.config.endpoint + 'CustomerRegistrationServices/updateCustomerData', formData).subscribe((response) => {
    });
  }

}