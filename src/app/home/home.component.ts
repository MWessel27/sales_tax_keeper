import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../app.service';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [

  ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './home.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  // Set our default values
  public localState = { value: '' };
  public salesTax: FirebaseListObservable<any[]>;
  public allTax: FirebaseListObservable<any[]>;
  public totalTax;
  public sentData: boolean;
  // TypeScript public modifiers
  constructor(
    public appState: AppState,
    public af: AngularFire
  ) {
    this.sentData = false;
  }

  public ngOnInit() {
    console.log('hello `Home` component');
    // this.title.getData().subscribe(data => this.data = data);
    this.calculateTax();
    this.salesTax = this.af.database.list('/tax');
  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
    this.salesTax.push(value);
    this.sentData = true;
    this.calculateTax();
  }

  public deleteTax(tax) {
    console.log(tax);
    this.af.database.list('/tax').remove(tax);
    this.calculateTax();
  }

  public calculateTax() {
    let total = 0.0;
    this.af.database.list('/tax', { preserveSnapshot: true})
    .subscribe((snapshots) => {
        snapshots.forEach((snapshot) => {
          total += parseFloat(snapshot.val());
          this.totalTax = total;
        });
    });
    console.log(this.totalTax);
  }

}
