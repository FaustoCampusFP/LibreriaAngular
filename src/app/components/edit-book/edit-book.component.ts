import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { BookService } from './../../shared/book.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

export interface Language {
  name: string;
}

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})

export class EditBookComponent implements OnInit {
  visible = true;
  selectable = true;
  selected = false;
  removable = true;
  addOnBlur = true;
  languageArray: Language[] = [];
  @ViewChild('chipList') chipList;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  editBookForm: FormGroup;
  BindingType: any = ['Tapa blanda', 'Tapa dura', 'Encuadernación a caballete', 'Encuadernación a espiral'];

  ngOnInit() {
    this.updateBookForm();
  }

  constructor(
    public fb: FormBuilder,    
    private location: Location,
    private bookApi: BookService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) { 
    var id = this.actRoute.snapshot.paramMap.get('id');
    this.bookApi.GetBook(id).valueChanges().subscribe(data => {
      console.log(data);
      if(!data.hasOwnProperty('languages'))
        data.languages=[];
      this.languageArray = data.languages;
      this.editBookForm.setValue(data);
    })
  }

  /* Update form */
  updateBookForm(){
    this.editBookForm = this.fb.group({
      book_name: ['', [Validators.required]],
      isbn_10: ['', [Validators.required]],
      author_name: ['', [Validators.required]],
      publication_date: ['', [Validators.required]],
      binding_type: ['', [Validators.required]],
      in_stock: ['Si'],
      languages: [''],
      image: ['https://voice.global/wp-content/plugins/wbb-publications/public/assets/img/placeholder.jpg']
    })
  }

  /* Add language */
  add(event: MatChipInputEvent): void {
    var input: any = event.input;
    var value: any = event.value;
    // Add language
    if ((value || '').trim() && this.languageArray.length < 5) {
      this.languageArray.push({name: value.trim()});
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /* Remove language */
  remove(language: any): void {
    const index = this.languageArray.indexOf(language);
    if (index >= 0) {
      this.languageArray.splice(index, 1);
    }
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.editBookForm.controls[controlName].hasError(errorName);
  }

  /* Date */
  formatDate(e) {
    var originalDate = new Date(e.target.value);
    originalDate.setDate(originalDate.getDate() + 1);
    var convertDate = originalDate.toISOString().substring(0, 10);
    this.editBookForm.get('publication_date').setValue(convertDate, {
      onlyself: true
    })
  }

  /* Go to previous page */
  goBack(){
    this.location.back();
  }

  /* Submit book */
  updateBook() {
    var id = this.actRoute.snapshot.paramMap.get('id');
    if(window.confirm('¿Estás seguro que quiere actualizar este libro?')){
        this.bookApi.UpdateBook(id, this.editBookForm.value);
      this.router.navigate(['books-list']);
    }
  }

}