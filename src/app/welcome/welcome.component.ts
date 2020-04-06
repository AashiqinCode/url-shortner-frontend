import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError, retry, shareReplay } from 'rxjs/operators';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }
  myurl: string = '';
  status: boolean = false;

  public onButtonClickFunction(): void {
    var test = this.greet()
    test.subscribe(res=>{
      console.log(res);
    },err=> {
      console.log(err);
    })
    console.log(this.greet());
    // var data = {
    //   url: this.myurl
    // }

    // this.http.post('http://localhost:9000/.netlify/functions/api/save',JSON.stringify(data)).subscribe(res=>{
    //   console.log(res)
    // },
    // err=>{
    //   console.log(err)
    // });

  }

  greet() : Observable<string> {
    return this.http.get<string>('http://localhost:9000/.netlify/functions/api/random').pipe(
      retry(3),
      catchError(()=> {
        return EMPTY;
      }),
      shareReplay(),
    )
  }
  //--------------------------------------------------------------------------------------------------------------------------------------------------------

  validClass() {
    document.getElementById('url').classList.remove('invalid');
    document.getElementById('url').classList.add('valid');
  }
  invalidClass() {
    document.getElementById('url').classList.remove('valid');
    document.getElementById('url').classList.add('invalid');
  }
  removeValidInvalid() {
    document.getElementById('url').classList.remove('valid');
    document.getElementById('url').classList.remove('invalid');
  }

  copiedClass() {
    document.getElementById('shortenurl').classList.add('copy-class');
  }

  removeCopiedClass() {
    document.getElementById('shortenurl').classList.remove('copy-class');
  }

  isValidURL() {
    if(document.getElementById('shortenurl').innerHTML !== 'MINIFY') {
      this.removeCopiedClass();
      document.getElementById('shortenurl').innerHTML = "MINIFY";
      return;
    }
    var regex = new RegExp("^((https{0,1}|ftp|rtsp|mms){0,1}://){1}(([0-9a-z_!~\\*'\\(\\)\\.&=\\+\\$%\\-]{1,}:\\ ){0,1}[0-9a-z_!~\\*'\\(\\)\\.&=\\+\\$%\\-]{1,}@){0,1}(([0-9]{1,3}\\.){3,3}[0-9]{1,3}|([0-9a-z_!~\\*'\\(\\)\\-]{1,}\\.){0,}([0-9a-z][0-9a-z\\-]{0,61}){0,1}[0-9a-z]\\.[a-z]{2,18}|localhost)(:[0-9]{1,4}){0,1}((/{0,1})|(/[0-9a-z_!~\\*'\\(\\)\\.;\\?:@&=\\+\\$,%#\\-]{1,}){1,}/{0,1})$","gi");
    this.status = regex.test(this.myurl);
    if(this.myurl.length>0) {
      if(this.status) {
        this.validClass();
      }
      else {
        this.invalidClass();
      }
    }
    else {
      this.removeValidInvalid();
    }
    return this.status;
  }


  copyTextToClipboard(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    document.getElementById('shortenurl').innerHTML = "COPIED!";
    this.copiedClass();
  }


  ShortenURL() : void {
    if(this.myurl.indexOf('amini.ml')>0) {
      this.myurl = "can't shorten specified url";
      return;
    }
    if(this.status && document.getElementById('shortenurl').innerHTML == 'MINIFY') {  
      document.getElementById('shortenurl').setAttribute('disabled','disabled');
      var data = {
        url: this.myurl
      }
      this.http.post('http://localhost:9000/.netlify/functions/api/save',JSON.stringify(data)).subscribe(res=>{
        console.log(res)
        this.myurl = 'https://amini.ml/' + res['code'];
        this.copyTextToClipboard(this.myurl);
        document.getElementById('shortenurl').removeAttribute('disabled');
      },
      err=>{
        console.log(err)
        document.getElementById('shortenurl').removeAttribute('disabled');
      });
    }
    else {
      document.getElementById('url').focus();
    }
  }

}
