<template>
    <div class="hi">
        <h1>SIGNING UP</h1>
        <div>
            <div>
                <p>Email</p>
                <input v-model="email" />
            </div>
            <div>
                <p>Password</p>
                <input v-model="password" type="password"/>
            </div>
            <button @click="signIn">Sign In</button>
        </div>
    </div>
</template>
    
<script>
import axios from 'axios';

import { mapGetters } from 'vuex'

export default {
  name: 'SignIn',
  data: () => {
      return {
          email: 'a@gmail.com',
          password: 'hello123',
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
    async signIn() {
      await axios.post(
        'http://localhost:4000/graphql',
        {
          query: `mutation SignIn {
                    signIn(email: "${this.email}", password: "${this.password}")
                  }`
        }
      ).then((response) => {
        if (response.data.data.signIn) {
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