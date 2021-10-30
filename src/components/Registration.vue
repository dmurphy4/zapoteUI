<template>
  <div class="hi">
    <div v-if="loggedIn">
      <p>Already logged in</p>
    </div>
    <div v-else>
      <h1>SIGNING UP</h1>
      <p>Already have an account?</p>
      <button @click="initSignIn">Sign In</button>
      <div style="padding-bottom: 5rem">
        <div>
          <p>Email</p>
          <input v-model="email" />
        </div>
        <div>
          <p>Password</p>
          <input v-model="password" type="password"/>
        </div>
        <div style="display: flex; justify-content: center;">
          <div>
            <p>First Name</p>
            <input v-model="firstName" />
          </div>
          <div>
            <p>Last Name</p>
            <input v-model="lastName" />
          </div>
        </div>
        <div style="display: flex; justify-content: center;">
          <div>
            <p>City</p>
            <input v-model="city" />
          </div>
          <div>
            <p>State</p>
            <input v-model="state" />
          </div>
        </div>
        <div>
          <p>Subjects you teach (Max 3)</p>
          <input v-model="currentSubject" @keyup.enter="enterSubject"/>
          <p style="font-size: 8px">{{ subjectMessage }}</p>
          <div style="display: flex; flex-wrap: wrap; width: 40%; margin: auto; background-color: lightgray; min-height: 5rem; margin-bottom: 1rem">
            <div v-for="(subject, index) in subjects" :key="index" style="display: flex; padding-left: 0.5rem; padding-right: 0.5rem; outline: 1px solid">
              <p @click="deleteSubject(index)" style="font-weight: bold; padding-right: 0.5rem; padding-top: 0.11rem">X</p>
              <p>{{ subject }}</p>
            </div>
          </div>
        </div>
        <button @click="signUp">Sign Up</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

import { mapGetters } from 'vuex';

export default {
  name: 'SignUp',
  data: () => {
      return {
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          city: '',
          state: '',
          subjects: [],
          currentSubject: '',
          subjectMessage: 'NOTE: Enter whatever you want'
      }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'loggedIn'
    })
  },
  watch: {
    loggedIn(newVal) {
      if (newVal) {
        this.$router.replace('/Profile');
      }
    }
  },
  methods: {
    initSignIn() {
      this.$router.push('/Registration/SignIn');
    },
    enterSubject() {
      if (this.subjects.length === 3) {
        this.subjectMessage = 'MAX OF 3, PLEASE'
      } else {
        if (!this.subjects.includes(this.currentSubject)) {
          this.subjects.push(this.currentSubject);
          this.currentSubject = '';
          this.subjectAlreadyExists = '';
        }
        else{
          this.subjectMessage = 'YOU ALREADY ENTERED THIS SUBJECT';
        }
      }
      
    },
    deleteSubject(index) {
      this.subjects.splice(index, 1);
    },
    async signUp() {
      await axios.post(
        'http://localhost:4000/graphql',
        {
          query: `mutation SignUp {
                    signUp(user: {
                      email: "${this.email}",
                      password: "${this.password}",
                      firstName: "${this.firstName}",
                      lastName: "${this.lastName}",
                      city: "${this.city}",
                      state: "${this.state}",
                      subjects: [
                        "${this.subjects.join('", "')}"
                      ]
                    })
                  }`
        }
      ).then((response) => {
        if (response.data.data.signUp) {
          this.$store.dispatch('SET_LOGGED_IN', true);
        }
      });
      if (this.loggedIn) {
        await axios.post(
          'http://localhost:4000/graphql',
          {
            query: `query getUser {
                      userInfo(email: "${this.email}") {
                        firstName
                        lastName
                        email
                        subjects
                        city
                        state
                        materials {
                          title
                        }
                      }
                    }`
          }
        ).then((response) => {
          this.$store.dispatch('SET_USER', response.data.data.userInfo);
        });
      }
    }
  }
}
</script>
