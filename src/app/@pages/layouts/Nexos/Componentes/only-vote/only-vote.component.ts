import { Component, OnInit } from '@angular/core';
import {card} from '../Servicios/dataCards'
declare var Swal: any;

@Component({
  selector: 'app-only-vote',
  templateUrl: './only-vote.component.html',
  styleUrls: ['./only-vote.component.scss']
})
export class OnlyVoteComponent implements OnInit {
  datas = ''
  carga = card
  title=''
  arrayCancidates: any = []
  votaciones:string []
  searchText: string = ''
  cantidad_votaciones:string=''



  flagVoteImage = true;
  contador = 0;
  
  constructor(

  ) {
    
   }
  ngOnInit() {
    this.cargaArray()
  }

  cargaArray(){
    let arraytin: any[] = []
    this.title = 'Votación de LeoArdo'
    arraytin.push({ 'titulo': this.title })
    arraytin.push({ 'arrayCandidatos': this.carga })
    this.arrayCancidates.push(arraytin)
    arraytin = []
    this.title = 'Votación 2'
    arraytin.push({ 'titulo': this.title })
    arraytin.push({ 'arrayCandidatos': this.carga })
    this.arrayCancidates.push(arraytin)
    // console.log(this.arrayCancidates)
    this.cargaPreliminar()
    
  }

  cargaPreliminar(){
    if(this.contador>=this.arrayCancidates.length){
      console.log('La votación a terminado')
    }else{
      // console.log(this.contador)
      this.votaciones = this.arrayCancidates[this.contador]
      this.title = this.votaciones[0]['titulo']
      this.datas = this.arrayCancidates[this.contador][1].arrayCandidatos
      //console.log(this.title)
    }
  }

//Se registra votacion al clickear candidato
  selectPost(data) {
    // If encargado de confirmar si la votacion es con imagen o no para asi poder mostrar imagen en modal
    if(this.flagVoteImage){
      let nombre = data.title;

      Swal.fire({
        title: 'Estas a punto de votar por <br><b> '+nombre+' <b><br>',
        text: '¿Estas Segur@?',
        imageUrl: data.img,
        imageWidth: 300,
        imageHeight: 350,
        imageAlt: 'Custom image',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'SI!'
      }).then((result) => {
        // console.log(result)
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Voto Exitoso!',
            html: 'Se ha registrado tu voto por : <b>'+nombre+'<b>',
            icon:'success'
        })
        this.contador++;
        // if(this.contador==this.arrayCancidates.length){
        //   Swal.fire({
        //     icon: 'success',
        //     title: 'LA VOTACIÓN A FINALIZADO',
        //   }).then((result)=>{
        //     if(result.isConfirmed){
        //       this.datas=''
        //     }
        //   })
        // }else{
          this.cargaPreliminar()
        // }
        
        }else{
          Swal.fire({
            title: 'VOTO NO REGISTRADO!',
            text:'Su voto no se ha guardado',
            icon:'error'
        })
        }
        this.searchText=''
      })
    }else{
      let nombre = data.title;

      Swal.fire({
        title: 'Estas a punto de votar por <br><b> '+nombre+' <b><br>',
        text: '¿Estas Segur@?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'SI!'
      }).then((result) => {
        console.log(result)
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Voto Exitoso!',
            html: 'Se ha registrado tu voto por : <b>'+nombre+'<b>',
            icon:'success'
        })
        }else{
          Swal.fire({
            title: 'VOTO NO REGISTRADO!',
            text:'Su voto no se ha guardado',
            icon:'error'
        })
        }
      })
    }
    // Fin del if
  }
}
