import { Injectable } from "@angular/core";

@Injectable()
export class Globals {
    time=0;
    id_conjunto: string;
    chat_count: number;
    messageLogin = true;
    reload_for_recaptcha = false;
}