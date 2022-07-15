import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationRestService } from '../../service/configuration.rest.service';
import { Globals } from '../../interface/globals.model';
import { Router } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { SendMessageService } from '../../service/send-message.service';
import { FormControl, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import { SocketService } from '../../service/socket.service';
declare var moment: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  profileForm = new FormGroup({
    message: new FormControl(''),
  });
  message: string;
  residential_id: any;
  user_id: string;
  meeting_id: string;
  unit_id: string;
  messages: any[] = [];
  interval: any;
  chats: number;
  is_mobil = false;
  code: any;
  id_user: any;
  votacion = 0;
  interval3: any;
  document_number: string;
  SistemaOperativo: string;
  keysession: string;
  newMessage: any = []
  is_speaker = 0;

  constructor(
    private httpClient: HttpClient,
    private config: ConfigurationRestService,
    private global: Globals,
    private router: Router,
    @Inject(SESSION_STORAGE)
    private storage: WebStorageService,
    private socketService: SocketService,
    private sendMessage: SendMessageService) {
    // this.router.errorHandler = (error: any) => { }
    this.votacion = 0;
    this.keysession = this.storage.get('token2');



    const userStorage = this.storage.get('usuario');
    const residentialStorage = this.storage.get('residential');
    if (this.storage.get('usuario') == null || this.storage.get('usuario') == undefined || this.storage.get('usuario') == '' ||
      this.storage.get('token') == null || this.storage.get('token') == undefined || this.storage.get('token') == '' ||
      this.storage.get('residential') == null || this.storage.get('residential') == undefined || this.storage.get('residential') == '' ||
      this.storage.get('token2') == null || this.storage.get('token2') == undefined || this.storage.get('token2') == '' ||
      this.storage.get('speaker') == null || this.storage.get('speaker') == undefined ||
      this.storage.get('observer') == null || this.storage.get('observer') == undefined ||
      this.storage.get('moroso') == null || this.storage.get('moroso') == undefined) {
      sessionStorage.clear();
      this.router.navigate(['login/' + this.residential_id]);
    }
    const unitStorage = this.storage.get('units');
    this.code = residentialStorage['uuid_code'];
    this.id_user = userStorage['user_id'];

    this.residential_id = residentialStorage['residential_id'];
    this.meeting_id = residentialStorage['meeting_id']
    this.user_id = userStorage['user_id'];
    this.is_speaker = this.storage.get('speaker');
    // this.unit_id = unitStorage[0]['unit_id'];

    this.document_number = userStorage['document_number'];

    this.httpClient.get(this.config.endpoint + 'PreRegisterMeetingServices/getMeetingDetails?key=' + this.config.key + '&residential_id=' + this.residential_id)
      .subscribe(resp => {
        if (resp['content']['meeting_status'] == '2') {
          swal.fire("Alerta", 'La asamblea ha finalizado, gracias por su asistencia', 'success');
          this.storage.remove('units');
          this.storage.remove('residential');
          this.storage.remove('usuario');
          this.storage.remove('token');
          this.router.navigate(['/login/' + this.residential_id]);
        }
      });
    this.httpClient.get(this.config.endpoint4 + 'ApiChat/getMessagesFromMeeting/' + this.keysession + '/' + this.meeting_id + '/50')
      .subscribe(resp2 => {
        this.messages = resp2['content']['messages'];
        for (let index = 0; index < this.messages.length; index++) {
          this.messages[index]['created_at'] = this.transformTimeZone(this.messages[index]['created_at']);
        }
        global.chat_count = resp2['content']['messages'].length;
        var isMobile = {
          mobilecheck: function () {
            return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(navigator.userAgent || navigator.vendor) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent || navigator.vendor).substr(0, 4)))
          }
        }
        this.is_mobil = isMobile.mobilecheck();
        if (this.is_mobil == false) {
          this.interval3 = setTimeout(function () {
            var element = document.getElementById("style-1");
            element.scrollTop = element.scrollHeight;
            (<HTMLInputElement>document.getElementById('focus')).focus();
          }, 2000);
        }
        else {
          this.interval3 = setTimeout(function () {
            var element = document.getElementById("style-1");
            element.scrollTop = element.scrollHeight;
          }, 2000);
        }
      });

    var isMobile = {
      mobilecheck: function () {
        return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(navigator.userAgent || navigator.vendor) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent || navigator.vendor).substr(0, 4)))
      }
    }
    this.is_mobil = isMobile.mobilecheck();
    $('#0').removeClass("active");
    $('#1').removeClass("active");
    $('#2').removeClass("active");
    $('#3').removeClass("active");
    $('#4').removeClass("active");
    $('#5').addClass("active");
    $('#6').removeClass("active");
  }

  ngOnInit() {
    var navInfo = window.navigator.appVersion.toLowerCase();
    var so = 'Sistema Operativo';

    if (navInfo.indexOf('win') != -1) {
      so = 'Windows';
    }
    else if (navInfo.indexOf('linux') != -1) {
      so = 'Linux';
    }
    else if (navInfo.indexOf('mac') != -1) {
      so = 'Macintosh';
    }
    this.SistemaOperativo = so;
    this.socketService.listen('meeting_chat_' + this.meeting_id).subscribe((response) => {
      this.newMessage = response;
      this.newMessage['created_at'] = this.transformTimeZone(this.newMessage['created_at']);
      this.messages.push(this.newMessage);
      setTimeout(() => {
        this.scrollBottom();
      }, 500);
    });
  }

  cancelPageRefresh() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  ngOnDestroy() {
    this.cancelPageRefresh();
    clearInterval(this.interval3);
    clearInterval(this.interval);
    this.socketService.removeListen('meeting_chat_' + this.meeting_id);
  }

  go() {
    this.router.navigate(['/home/chat/list'])
  }

  scrollBottom() {
    var element = document.getElementById("style-1");
    element.scrollTop = element.scrollHeight;
  }

  onSubmit() {
    if (this.profileForm.value.message == '' || this.profileForm.value.message == ' ') {
      swal.fire({
        title: '<strong>Atención</strong>',
        type: 'error',
        html:
          'No puede enviar mensajes vacíos',
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: true,
        confirmButtonText:
          '<i class="fa fa-thumbs-up"></i> ok',
        cancelButtonText:
          '<i class="fa fa-thumbs-down"></i> No',
        confirmButtonColor: '#e56e22',
        timer: 10000
      })
      return
    }
    if (this.profileForm.value.message == null || this.profileForm.value.message == 'null') {
      swal.fire({
        title: '<strong>Atención</strong>',
        type: 'error',
        html:
          'No se pueden enviar caracteres especiales',
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: true,
        confirmButtonText:
          '<i class="fa fa-thumbs-up"></i> ok',
        cancelButtonText:
          '<i class="fa fa-thumbs-down"></i> No',
        confirmButtonColor: '#e56e22',
        timer: 10000
      })
      return
    }
    const formData = new FormData();
    formData.append('meeting_id', this.meeting_id);
    formData.append('message', this.profileForm.value.message);
    this.sendMessage.sendMessage(formData, this.keysession, this.residential_id);
    this.message = '';
    this.profileForm.reset();
  }

  // transformToZone() {
  //   var date = new Date();
  //   var offset = date.getTimezoneOffset();
  //   $("#popping_time").html(offset + '');
  //   var dateContainers = document.querySelectorAll(".date_container");
  //   for (var container of dateContainers as any) {
  //     var dateGot = container.innerHTML.trim();
  //     if (dateGot.length > 0) {
  //       var day = moment(dateGot);
  //       var updateTime = offset * -1;
  //       var dateLocalized = day.add(updateTime, 'minutes');
  //       var dateFormatted = dateLocalized.format('L');
  //       var timeFormatted = dateLocalized.format('LT');
  //       container.innerHTML = dateFormatted + ' ' + timeFormatted;
  //     }
  //   }
  // }

  transformTimeZone(dateToTransform) {
    var date = new Date();
    var offset = date.getTimezoneOffset();
    var dateGot = dateToTransform.trim();
    if (dateGot.length > 0) {
      var day = moment(dateGot);
      var updateTime = offset * -1;
      var dateLocalized = day.add(updateTime, 'minutes');
      // var dateFormatted = dateLocalized.format('L');
      var timeFormatted = dateLocalized.format('LT');
      return timeFormatted;
    }
  }
}