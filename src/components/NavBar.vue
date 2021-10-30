<template>
    <div class="parent-nav">
        <div class="navbar">
            <div class="pages">
                <router-link to="/" class="page">Home</router-link>
                <router-link to="/Profile" class="page">My Profile</router-link>
                <router-link to="/Registration" class="page">Sign Up</router-link>
            </div>
            <div>
                <router-link v-if="loggedIn" to="/Registration" @click="signOut">Sign Out</router-link>
                <router-link v-else to="/Registration/SignIn">Sign In</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'NavBar',
    computed: {
        ...mapGetters({
            loggedIn: 'loggedIn'
        })
    },
    methods: {
        signOut() {
            this.$store.dispatch('LOG_OUT');
        }
    }
}

</script>

<style>
.parent-nav {
    background-color: darkorange;
}
.navbar {
    display: flex;
    justify-content: space-between;
    margin: auto;
    width: 75%;
    padding: 1.5rem;
}
.pages {
    display: flex;
    justify-content: space-around;
}
.page {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
}
</style>