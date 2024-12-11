import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './adminprofile.component.html',
  styleUrls: ['./adminprofile.component.scss'],
})
export class AdminProfileComponent implements OnInit {
  isEditing = false;
  uploadSuccess = false;
  profileUpdated = false;

  user = {
    name: '',
    location: 'Unknown', //Added default value
    age: '24',
    sex: 'Unknown', //Added default value
    vaccinationStatus: 'yes',
    role: 'Unknown', //Added default value
    email: '',
    contact: 'Unknown', //Added default value
    region: 'Unknown', //Added default value
    profilePictureUrl: 'assets/profile-placeholder.png', // Added default image
  };

  tempUser = { ...this.user };

  activities = [
    { description: "You added a role 'Sales Lead'", timestamp: '19/02/2023 10:40:55 AM' },
    { description: "You assigned task 'API Integration' to a role 'Technical Lead - BE'", timestamp: '19/02/2023 09:40:55 AM' },
  ];

  onEditProfile() {
    this.tempUser = { ...this.user };
    this.isEditing = true;
  }

  closeModal() {
    this.tempUser = { ...this.user };
    this.isEditing = false;
    this.uploadSuccess = false; // Reset upload success message
  }

  saveProfile() {
    this.user = { ...this.tempUser };
    localStorage.setItem('userName', this.user.name);
    localStorage.setItem('userEmail', this.user.email);
    localStorage.setItem('userSex', this.user.sex);
    localStorage.setItem('userLocation', this.user.location);
    localStorage.setItem('userRole', this.user.role);
    localStorage.setItem('userContact', this.user.contact);
    localStorage.setItem('userRegion', this.user.region);
    localStorage.setItem('profilePictureUrl', this.user.profilePictureUrl);


    this.profileUpdated = true;
    setTimeout(() => this.profileUpdated = false, 3000);
    this.isEditing = false;
  }

  onProfilePictureUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.tempUser.profilePictureUrl = reader.result as string;
        this.uploadSuccess = true;
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