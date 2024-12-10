import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './adminprofile.component.html',
  styleUrls: ['./adminprofile.component.scss'],
})
export class AdminProfileComponent implements OnInit {
closePopup() {
throw new Error('Method not implemented.');
}
  isEditing = false;
  uploadSuccess = false;
  profileUpdated = false; // To control the success pop-up visibility

  user = {
    name: '',
    location: '',
    age: '24',
    sex: '',
    vaccinationStatus: 'yes',
    role: '',
    email: '',
    contact: '',
    region: '',
    profilePictureUrl: '',
  };

  tempUser = { ...this.user } // Create a temporary object to hold form values

  activities = [
    { description: "You added a role 'Sales Lead'", timestamp: '19/02/2023 10:40:55 AM' },
    { description: "You assigned task 'API Integration' to a role 'Technical Lead - BE'", timestamp: '19/02/2023 09:40:55 AM' },
  ];

  onEditProfile() {
    this.tempUser = { ...this.user }; // Copy user data to tempUser
    this.isEditing = true;
  }

  closeModal() {
    this.isEditing = false;
  }

  saveProfile() {
    this.user.name = this.tempUser.name;
    this.user.email = this.tempUser.email;
    this.user.sex = this.tempUser.sex;
    this.user.location = this.tempUser.location;
    this.user.role = this.tempUser.role;
    this.user.contact = this.tempUser.contact;
    this.user.region = this.tempUser.region;

    localStorage.setItem('userName', this.user.name);
    localStorage.setItem('userEmail', this.user.email);
    localStorage.setItem('userSex', this.user.sex);
    localStorage.setItem('userLocation', this.user.location);
    localStorage.setItem('userRole', this.user.role);
    localStorage.setItem('userContact', this.user.contact);
    localStorage.setItem('userRegion', this.user.region);

    this.profileUpdated = true; // Show the success pop-up
    setTimeout(() => this.profileUpdated = false, 3000); // Hide pop-up after 3 seconds
    this.closeModal();
  }

  onProfilePictureUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.user.profilePictureUrl = reader.result as string;
        this.uploadSuccess = true;
        localStorage.setItem('profilePictureUrl', this.user.profilePictureUrl);
      };

      reader.readAsDataURL(file);
    }
  }

  ngOnInit() {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    const storedSex = localStorage.getItem('userSex');
    const storedLocation = localStorage.getItem('userLocation');
    const storedRole = localStorage.getItem('userRole');
    const storedContact = localStorage.getItem('userContact');
    const storedRegion = localStorage.getItem('userRegion');
    const storedImage = localStorage.getItem('profilePictureUrl');

    if (storedName) this.user.name = storedName;
    if (storedEmail) this.user.email = storedEmail;
    if (storedSex) this.user.sex = storedSex;
    if (storedLocation) this.user.location = storedLocation;
    if (storedRole) this.user.role = storedRole;
    if (storedContact) this.user.contact = storedContact;
    if (storedRegion) this.user.region = storedRegion;
    if (storedImage) this.user.profilePictureUrl = storedImage;
  }
}