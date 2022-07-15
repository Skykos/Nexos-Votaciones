import { Component, OnInit ,ContentChild,TemplateRef, ViewChild} from '@angular/core';
import { ListViewContainerComponent } from '../list-view-container/list-view-container.component'
@Component({
  selector: 'pg-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {

  @ContentChild('ItemHeading', { read: true, static: false }) _itemHeading: TemplateRef<void>;
  @ViewChild(TemplateRef, { read: true, static: false }) _content: TemplateRef<void>;

  get content(): TemplateRef<void> | null {
    return this._content;
  }


  constructor(private pgItemView: ListViewContainerComponent) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.pgItemView._items.splice(this.pgItemView._items.indexOf(this), 1);
  }


}
