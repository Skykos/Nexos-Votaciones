import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-finalizo',
  templateUrl: './finalizo.component.html',
  styleUrls: ['./finalizo.component.scss']
})
export class FinalizoComponent implements OnInit {
  id_building: string;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.id_building = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit() {
  }

}
