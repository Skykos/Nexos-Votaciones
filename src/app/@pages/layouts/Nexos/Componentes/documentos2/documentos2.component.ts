import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Globals } from '../../interface/globals.model';
import { ConfigurationRestService } from '../../service/configuration.rest.service';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-documentos2',
  templateUrl: './documentos2.component.html',
  styleUrls: ['./documentos2.component.scss']
})
export class Documentos2Component implements OnInit {

  listDocument: [] = [];
  residential_id: any;
  var: string;

  constructor(
    private httpClient: HttpClient,
    private config: ConfigurationRestService,
    private router: Router,
    @Inject(SESSION_STORAGE)
    private storage: WebStorageService,) {
    const residentialStorage = this.storage.get('residential');
    if (this.storage.get('usuario') == null || this.storage.get('usuario') == undefined || this.storage.get('usuario') == '' ||
    this.storage.get('token') == null || this.storage.get('token') == undefined || this.storage.get('token') == '' ||
    this.storage.get('residential') == null || this.storage.get('residential') == undefined || this.storage.get('residential') == '' || 
    this.storage.get('token2') == null || this.storage.get('token2') == undefined || this.storage.get('token2') == ''||
    this.storage.get('speaker') == null || this.storage.get('speaker') == undefined ||
    this.storage.get('observer') == null || this.storage.get('observer') == undefined ||
    this.storage.get('moroso') == null || this.storage.get('moroso') == undefined) {
       sessionStorage.clear();
      this.router.navigate(['login/' + this.residential_id]);
    }

    this.residential_id = residentialStorage['residential_id'];

    this.httpClient.get(this.config.endpoint + 'PreRegisterMeetingServices/getMeetingFilesListedEncoded?key=' + this.config.key + '&residential_id=' + this.residential_id)
      .subscribe(resp2 => {
        this.listDocument = resp2['content']
      });
    $('#0').removeClass("active");
    $('#1').removeClass("active");
    $('#2').removeClass("active");
    $('#3').removeClass("active");
    $('#4').addClass("active");
    $('#5').removeClass("active");
    $('#6').removeClass("active");
  }

  ngOnInit() {
  }

  download(documentId, nameFile) {
    this.httpClient.get(this.config.endpoint + 'PreRegisterMeetingServices/getMeetingFileById?key=' + this.config.key + '&id=' + documentId)
      .subscribe(response => {
        var file = new Blob([this._base64ToArrayBuffer(response['content']['file_content'])], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.download = nameFile;
        fileLink.click();
        //Method secondary
        // var win = window.open();
        // win.document.write('<iframe src="' + fileURL + '" name="'+ nameFile +'" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
      });
  }

  _base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

}