import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';

import { Feedback, ContactType } from '../shared/feedback';
import { visibility, flyInOut, expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  providers: [FeedbackService],
  host: {
  '[@flyInOut]': 'true',
  'style': 'display: block;'
  },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  fbSubmitted: Feedback[];
  feedbackCopy: Feedback;
  contactType = ContactType;
  feedbackSubmissionInProgress: boolean = false;
  displayFeedbackAfterPost: boolean = false;
  errMess: string;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  @ViewChild(FormGroupDirective) feedbackFormDirective;

  constructor(private feedbackservice: FeedbackService,
      private fb: FormBuilder,
      @Inject('BaseURL') private BaseURL) {
        this.createForm();
      }

  ngOnInit() {
    this.displayFeedbackAfterPost = false;
  }

  createForm(): void {
      this.feedbackForm = this.fb.group({
        firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        telnum: ['', [Validators.required, Validators.pattern] ],
        email: ['', [Validators.required, Validators.email] ],
        agree: false,
        contacttype: 'None',
        message: ''
      });

      this.feedbackForm.valueChanges
        .subscribe(data => this.onValueChanged(data));

      this.onValueChanged();
    }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit() {
    this.feedbackSubmissionInProgress = true;
    this.feedback = this.feedbackForm.value;

    this.feedbackCopy = this.feedback;
    this.feedbackservice.submitFeedback(this.feedback)
    .subscribe(fbSubmitted => {this.fbSubmitted = fbSubmitted;
        this.feedbackSubmissionInProgress = false;
        console.log(this.fbSubmitted);
        this.displayFeedbackAfterPost = true;
        setTimeout(()=>{this.displayFeedbackAfterPost=false}, 5000);
      }, errmess => {this.fbSubmitted = null, this.errMess = <any>errmess;});

    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }

}
