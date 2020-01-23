

<template>

<v-img class="image">
  <v-app id="inspire" color="blue">
   
      <v-container
       
        class="fill-height"
        fluid
      >
        <v-row
          align="top"
          justify="center"
        >
          <v-col
            cols="100"
            sm="80"
            md="30"
          >
           <v-toolbar-title>
                 
                
                  <div class="display-4">
                    <div class="font-weight-black" >
                  

                  C O S W E A L
                  
</div>
                    </div>

                </v-toolbar-title>
             <v-toolbar-title>
               


                </v-toolbar-title>
                <v-toolbar-title>
                 <div class="font-weight-black">
                  
               <h2> Enter your e-mail and password to Log in
               </h2>
</div>
                


                </v-toolbar-title>
                <div class="flex-grow-1"></div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    
                  </template>
                  
                </v-tooltip>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn 
                      icon
                      large
                      href="https://codepen.io/johnjleider/pen/pMvGQO"
                      target="_blank"
                      v-on="on"
                    >
                  
                    </v-btn>
                  </template>
                  
                </v-tooltip>
             
              
                <v-form>
                  <v-text-field
                    label="Login"
                    type="text"
                    v-model='id'
                  ></v-text-field>

                  <v-text-field
                    label="Password"
                    v-model='pw'
                    type="password"
                  ></v-text-field>
                   <v-btn type="sumit" value="Submit" class="abc" block color="primary" @click='loginClick'>Login</v-btn>
                </v-form>
                
      <p>{{ selected }}</p>
      



              <v-card-actions>

       <input class = "rember"  color =black type="checkbox"  checked v-model="selected" ><span class="rember" >&emsp; remember id/password </span>                  
                <v-low>
          
               
     
   
 

                <div class="flex-grow-1"></div>
               
              

                </v-low>
              
              
   
<a class="link"  href="http://www.cosweal.com/main/main.php">
      
    <div> forget id/password? </div>
     </a>

              </v-card-actions>
             <v-row justify="space-around" class="mb-2">
      <span class="group pa-2">
      <a class="link" href="http://www.cosweal.com/main/main.php">
      
     <!-- <v-icon btn large color="black">help_outline</v-icon> -->
     </a>
      </span>
 </v-row>
 <div color= "black" class="font-weight-black" id=about>

               <h4> About COSWEAL
               </h4>
</div>

          </v-col>
        </v-row>
      </v-container>
  </v-app>
  </v-img>
</template>>

<script>
  import axios from 'axios'

  export default { 
    created() { 
        // this.$http.get("/api/logins").then(response => { 
        //     this.users = response.data; 
        // }); 
    }, 
    data() { 
        return { 
            id:'',
            pw:'',
            page:false
        }; 
    },
    methods: {
      loginClick(){
        console.log('로그인 클릭')
        axios.post('http://192.168.0.201:3000', {
              org_id:this.id,
              user_pw:this.pw,
          })
          .then((r) => {
            console.log(r.data.page)
            this.page = r.data.page
            console.log(this.page)
          })
          .catch((e) => {
            alert("에러가 발생하였습니다.")
            console.error(e.message)
          })
      },
    }
}; 
</script>
<style>
v-low {
    margin-left: 28%;
    margin-top: 2%
}
.icon{
  margin-left: 10%
}
#about{
  color: black
}
#inspire{
    /* background-image: url('../assets/aaa.png') */
}
.rember
{
   margin-left: 0 ;
text-align: center;

}
#about{
  margin-left: 42%;
}
.link{
text-decoration:none;
color: #000000;
margin-left: 30%;
text-align: center;
margin-top: 3.9%
}
.link a{

color: #000000;
}
.a{

color: #000000;
}

.v-application .accent--text {
    color:black;
    caret-color: black;
}

.v-card__actions > a.link{
color:black;
}
</style>