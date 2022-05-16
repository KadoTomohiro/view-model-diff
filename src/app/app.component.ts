import { Component } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {interval} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'view-model-diff';

  form = new FormGroup({
    password: new FormControl(0)
  })

  constructor() {
    this.form.valueChanges.subscribe(() => console.log(this.form.touched))
  }
}
