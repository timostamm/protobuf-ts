import {Component} from '@angular/core';
import {DateTime} from '../../protoc-gen-ts-out/google/type/datetime';
import {Timestamp} from '../../protoc-gen-ts-out/google/protobuf/timestamp';

@Component({
  selector: 'app-pb-date-pipe',
  templateUrl: './pb-date-pipe.component.html',
  styleUrls: ['./pb-date-pipe.component.css']
})
export class PbDatePipeComponent {


  jsDate = new Date(2020, 11, 24, 11, 45, 59);
  isoDate = this.jsDate.toISOString();
  dateTime = DateTime.fromJsDate(this.jsDate);
  timestamp = Timestamp.fromDate(this.jsDate);


  constructor() {
  }


}
