<template>
  <div class="profile">
    <div v-if="loggedIn">
      <h1>{{ userData.firstName }} {{ userData.lastName }}</h1>
      <div>
        <p> {{ userData.city }}, {{ userData.state }} </p>
        <p> You teach - {{ subjectsString }}</p>
      </div>
      <div>
        <h3 style="margin-bottom:0.25rem; margin-top: 2rem">Your Materials</h3>
        <div v-if="userData.materials && userData.materials.length === 0">
          <p>Looks like you don't have any materials yet.</p>
        </div>
        <div v-else class="materials">
          <div class="material" v-for="(material, index) in userData.materials" :key="index" style="">
            <p style="margin-left: 1rem"> {{ material.title }}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; width: 13%">
              <button :disabled="true">View</button>
              <button style="margin-right: 1rem;" @click="deleteMaterial(material.title)">Delete</button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3>Upload New Material</h3>
        <div class="new-material">
          <div style="padding-bottom: 1rem; display: flex; justify-content: space-around; width: 50%; margin: auto">
            <div>
              <label>Name:</label>
              <input v-model="materialToUpload.title">
            </div>
            <input type="file" ref="fileUpload" @change="previewFiles">
          </div>
          <button :disabled="materialToUpload.title === '' || materialToUpload.data === ''" @click="uploadMaterial">Upload</button>
        </div>
      </div>
    </div>
    <div v-else>
      <h1>you're not logged in. please to go log in or sign up!</h1>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'Profile',
  data() {
    return {
      materialToUpload: {
        title: '',
        data: ''
      },
      file: null
    }
  },
  computed: {
    subjectsString() {
      if (this.userData.subjects) {
        return this.userData.subjects.join(', ');
      }
      return '';
    },
    ...mapGetters({
      loggedIn: 'loggedIn',
      userData: 'userData'
    })
  },
  methods: {
    previewFiles(event) {
      const parent = this;
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
        parent.materialToUpload.data = reader.result;
      }, false);
      
      reader.readAsDataURL(event.target.files[0]);
    },
    async uploadMaterial() {
      await axios.post(
        'http://localhost:4000/graphql',
        {
          query: `mutation AddMaterial {
            addMaterial(material: {
              email: "${this.userData.email}",
              material: {
                title: "${this.materialToUpload.title}",
                data: "${this.materialToUpload.data}"
              }
            })
          }`
        }).then((response) => {
            if (response.data.data.addMaterial) {
              this.getMaterials();
              this.materialToUpload = {
                title: '',
                data: ''
              }
              this.$refs.fileUpload.value=null;
            }
          });
    },
    async deleteMaterial(title) {
      await axios.post(
        'http://localhost:4000/graphql',
        {
          query: `mutation DeleteMaterial {
                    deleteMaterial(input: {
                      email: "${this.userData.email}",
                      name: "${title}"
                    })
                  }`
        }
      ).then((response) => {
        if (response.data.data.deleteMaterial) {
          this.getMaterials();
        }
      });
    },
    async getMaterials() {
      await axios.post(
        'http://localhost:4000/graphql',
        {
          query: `query GetMaterials {
                    userInfo(email: "${this.userData.email}") {
                      materials {
                        title
                        data
                      }
                    }
                  }`
        }
      ).then((response) => {
        if (response.data.data.userInfo.materials) {
          this.$store.dispatch('SET_MATERIALS', response.data.data.userInfo.materials);
        }
      });
    }
  }
}

</script>

<style>
.materials {
  display: flex;
  flex-direction: column;
  max-height: 15rem;
  overflow-y: scroll;
}
.material {
  margin: auto;
  width: 75%;
  border: 2px solid darkred;
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
  display: flex;
  justify-content: space-between;
}
</style>