<template>
  <v-card>   
    <v-card-title>
      게시판
      <v-spacer></v-spacer>
      <v-text-field 
        v-model="search"
        append-icon="mdi-heart"
        label="검색어입력"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-snackbar
      :timeout=10000
      v-model="confirm_"
      top
      multi-line
      color="error"
      dark
      icon="mdi-alert-circle-outline"
      transition="scale-transition"
    >
      {{confirmText}}
      <v-btn flat  color="error"  @click="confirmYes(item)">네</v-btn>
      <v-btn flat  color="error"  @click="confirmNo">아니요</v-btn>
    </v-snackbar>

    <v-data-table
      :headers="headers"
      :items="posts"
      :search="search"
      :page.sync="page"
      :items-per-page="12"
      hide-default-footer
      class="elevation-1"
      @page-count="pageCount = $event"  
       style="border-top:1px black solid;border-bottom:1px black solid"
    > 
      <template v-slot:item.catagory="{ item }">
        <v-chip :color="getColor(item.catagory)" dark>  {{item.catagory}} </v-chip>
      </template>
      
      <template v-slot:item.title="props">
        <a @click="boardDetail(props.item)" style="color:black;text-align:left;display:block;">
            {{props.item.title}}
        </a>
      </template>

    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>

    <v-btn
      bottom
      color="purple darken-4"
      dark
      fab
      fixed
      right
      @click="openAddModal"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-dialog
      v-model="dialog2"
      width="800px"
      persistent
    >
      <v-snackbar
        :timeout=10000
        v-model="confirmComment"
        top
        multi-line
        persistent
        color="error"
        dark
        icon="mdi-alert-circle-outline"
        transition="scale-transition"
      >
        {{confirmCommentText}}
        <v-btn flat  color="error"  @click="confirmCommentYes">네</v-btn>
        <v-btn flat  color="error"  @click="confirmCommentNo">아니요</v-btn>
      </v-snackbar>

      <v-card>
        <v-system-bar window dark>
          
          <span>작성일 : {{form.createdAt}}</span>
          <v-spacer></v-spacer>
           <!--  -->
          
            <v-icon v-if="user === form.writer"
              small
              class="mr-2"
              @click="openEditModal(form)"
            >
              mdi-pencil
            </v-icon>
            <v-icon v-if="user === form.writer"
              small
              @click="deletePost(form)"
            >
              mdi-delete
            </v-icon>
          
          <!--  -->
          <v-btn 
          icon
          dark>
            <v-icon 
            @click="modalClose2">mdi-close</v-icon>
          </v-btn>
        </v-system-bar>
       
        <v-card-title 
          style="color:white;background-color:#230871">{{form.title}}
        </v-card-title>
        
      <v-container
        class="overflow-y-auto"
        style="max-height: 500px"
        id="scroll-target"
      >
        <v-layout wrap row>
          <v-flex>
            <viewer  :value="form.content" style="min-height:300px;"  class="ma-4"></viewer>
           <v-divider style="background-color:#000000" ></v-divider>
        <!-- <v-container
          class="overflow-y-auto"
         style="max-height: 500px"
         id="scroll-target"
         > -->
       <v-list three-line>
       <v-list-item
        v-for="item in comments"
        :key="item.id"
        style="border-bottom:1px grey dashed"
       >
        <v-list-item-avatar>
          <v-icon size="80"> mdi-account-circle</v-icon>
        </v-list-item-avatar>
 
        <v-list-item-title>
                <strong>{{item.writer}}</strong> {{item.createdAt}}<!--item.title-->
             <v-list-item-content>{{item.content}} <!--v-text="item.content"--> 
             </v-list-item-content>
        </v-list-item-title>

            <v-icon v-if="user === item.writer"
              @click="modCommentDialog(item)"
              small
            >mdi-pencil
            </v-icon>
          
            <v-icon v-if="user === item.writer"
              small
              right
              @click="deleteComment(item)"
            >mdi-delete
            </v-icon>
       
      </v-list-item>
    </v-list>
    
  </v-flex>
        
  <!-- </v-container> -->
  </v-layout>
</v-container>
        
<!-- 댓글쓰기란!-->
<v-container>
  <v-text-field
    v-model="commentAdd"
    label="댓글 작성"
    append-outer-icon="mdi-send"
    @click:append-outer="addComment"
  >
</v-text-field>
</v-container>
<!-- 댓글!-->
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialog"
      width="800px"
      persistent
    >
      
      <v-card>
        <v-card-title class="blue-grey" v-model="form.title" style="border:1px black solid">
          <p class=font-weight-black id=board> 게시판 </p>
        </v-card-title>
          <v-row 
          class="ma-0"
          > 
            <v-col
              class="align-center justify-space-between"
              cols="12"
            >
            
              <v-row align="center">
                <v-avatar
                  size="40px"
                  class="mr-4"
                >
                </v-avatar>
                <v-form ref="form" v-model="valid" lazy-validation style="width:500px">
                  <v-text-field
                    placeholder="제목을 입력해주세요" 
                    v-model="form.title"
                    :rules="titleRules"
                  ></v-text-field>
                </v-form>
              </v-row>
            </v-col>
            
            <v-container>
              <editor v-model="form.content"/>
            </v-container>
            
          </v-row>
        <v-card-actions>
          <v-card-text>
            <v-row
                align="center"
                justify="center"
            >
              <v-col>

                <v-btn-toggle
                  v-model="text"
                  color="deep-purple accent-3"
                  
                  rounded
                  style="background-color:grey"
                >
                  <v-btn value="left" @click="setNormal" >
                    일반
                  </v-btn>
                  <v-btn value="center" @click="setNotice">
                    공지
                  </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
          </v-card-text>
          <v-btn
            color="blue-grey"
            @click="saveClick()"
          >저장</v-btn>
          <v-btn
            color="blue-grey"
            @click="modalClose"
          >취소</v-btn>
        </v-card-actions>
        
        <v-snackbar
          :timeout='false'
          v-model="alert"
          top
          persistent
          multi-line
          color="blue lighten-2"
          dark
          icon="mdi-alert-circle-outline"
          transition="scale-transition"
        >
        {{alertText}}
        <v-btn flat  color="blue lighten-2"  @click="alertConfirm">확인</v-btn>
        </v-snackbar>

      </v-card>
    </v-dialog>
      <v-dialog v-model="commentDialog" width="500">
        <v-card>
              
            <v-card-title 
            style="color:white;background-color:#230871"
            
            >
              댓글 수정
             <v-spacer>
             </v-spacer>
        <v-icon 
        dark
        @click="modalClose3()">
        mdi-close
        </v-icon>
        </v-card-title>

            <v-card-text>
        <v-text-field
          label="댓글 수정"
          v-model="commentModify"
          append-outer-icon="mdi-pencil"
          @click:append-outer="modComment(item)"
        />
            </v-card-text>
        </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import axios from 'axios'

  export default {
    props: {
      source: String,
    },

  mounted () {
      const token = localStorage.token
      this.user = localStorage.getItem('user')
      axios.get('http://192.168.0.201:3000/api/board', {
        //headers: { Authorization: token },
      })
      .then((r) => {
        
        let j=0;

        for(j=0;j<r.data.posts.length;j++){
          var y = r.data.posts[j].createdAt.substr(0, 4);
          var m = r.data.posts[j].createdAt.substr(5, 2);
          var d = r.data.posts[j].createdAt.substr(8, 2);
          var h = r.data.posts[j].createdAt.substr(11, 2);
          var min = r.data.posts[j].createdAt.substr(14, 2);
          var s = r.data.posts[j].createdAt.substr(17, 2);
          var temp = y+'-'+m+'-'+d+' '+h+':'+min+':'+s
          
          //r.data.posts[j].createdAt = y+'-'+m+'-'+d+' '+h+':'+min+':'+s

          var diffDate_1 = temp instanceof Date ? temp :new Date(temp);
          var diffDate_2 = new Date();
      
          diffDate_1 =new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
          diffDate_2 =new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());
      
          var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
          diff = Math.ceil(diff / (1000 * 3600 * 24));

          if(diff<1)
            r.data.posts[j].createdAt = h+':'+min+':'+s
          else
            r.data.posts[j].createdAt = y+'-'+m+'-'+d +' '+h+':'+min+':'+s
        }

        this.posts = r.data.posts
        this.posts.reverse()
        this.posts.sort(function (a, b) { 
          return a.catagory < b.catagory ? -1 : 1;  
        });
      })
      .catch((e) => {
          console.error(e.message)
      })
    },

    data () {
      return {
        totalItem:0,
        valid:true,
        alertText:'',
        confirmText:'',
        confirmCommentText:'',
        general:'',
        catagory:'',
        id:'',
        name:'',
        user:'',
        comments: [],
        commentId:0,
        commentAdd:"",
        commentDialog: false, //두번째 수정하기창
        commentModify:'',
        commentSell:null,
        boardId:0,
        snackbar: false,
        timeout: 999,
        dialog: false,
        dialog2: false,
        flag:'post',
        alert: false,
        confirm_: false,
        confirmComment: false,
        page: 1,
        pageCount: 0,
        search: '',
        postCreateLink:[
          {
            to: {path: '/board/create'}
          }
        ],
        getMd: '',
        headers: [
          { width:'100px',
            text: '말머리',
            sortable: false,
            value: 'catagory',
            align: 'center',
          },
          { text: '번호', value: 'id' ,align: 'center', sortable: false},
          {
            text: '제목',
            align: 'center',
            sortable: false,
            value: 'title',
          },
          { text: '작성자', value: 'writer' , align: 'center', sortable: false},
          { text: '작성일', value: 'createdAt' , align: 'center', sortable: false},
          { text: '조회수', value: 'views', sortable: false , align: 'center'},
        ],
        form: {
          id:1,
          title: '',
          writer:'',
          content: '',
          createdAt:''
        },
        titleRules: [
            v => !!v || '제목을 입력해주세요',
        ],
        
        copyPosts:[],
        posts: [
          {
            catagory:'fdfdf',
            id:'111',
            content:'fdfdfdfdf',
            title:'관리자',
            writer:'김민석',
            createdAt:222,
          },
          {
            catagory:'fdfdf',
            id:'111',
            content:'fdfdfdfdf',
            title:'관리자',
            writer:'김민석',
            createdAt:222,
          },    
        ],
      }
    },
    methods: 
    {
      modCommentDialog (cmt) {
        this.commentDialog = true
        this.commentId = cmt.id
        this.commentModify = cmt.content //현재의 컨텐츠 내용
        this.commentSell = cmt  
      },
      addComment()
      {
        axios.post('http://192.168.0.201:3000/api/board/comment/add', {
          boardId:this.boardId,
          writer:this.user,
          content:this.commentAdd,
        })
        .then((r) => {
          const comment = {
            content:this.commentAdd,
            boardId: this.boardId,
            id: r.data.comment.id,
            writer:this.user,
            createdAt:'New'
          }
          this.comments.push(comment)
          this.commentAdd=''
        })
        .catch((e) => {
          this.alertText='에러가 발생했습니다'
          this.alert=true
          console.error(e.message)
        })
      },
      deleteComment(item){
        this.confirmCommentText='정말 삭제하시겠습니까?'
        this.confirmComment=true
        this.commentId=item.id

      },
      modComment()
      {
        this.commentSell.content = this.commentModify
        this.commentDialog=false

        axios.put('http://192.168.0.201:3000/api/board/comment', //
            { 
              id: this.commentId,
              content: this.commentSell.content 
            } 
          )
          .then((r) => {
            let i=0;
            for(i=0;i<this.comments.length;i++){
              if(this.comments[i].id === this.commentId){
                this.comments[i].content = this.commentSell.content 
              }
            }
          })
          .catch((e) => {
            this.alertText='에러가 발생했습니다'
            this.alert=true
            console.error(e.message)
          })
      },
      boardDetail(item){
        item.views= item.views+1
        this.boardId = item.id
        this.form.id = item.id
        this.form.title = item.title
        this.form.writer = item.writer
        this.form.content = item.content
        console.log(this.form.content)

        if(item.createdAt.length < 10){
          var today = new Date()
          console.log(today)
          this.form.createdAt = today.getFullYear()+'-'+(today.getMonth()+1)+'-' +today.getDate()+' '+ item.createdAt
        }
        else
          this.form.createdAt = item.createdAt
        axios.post('http://192.168.0.201:3000/api/board/comment', {
          boardId: item.id,
          views: item.views})
          .then((r) => {
            let j=0;
            console.log(r)
            for(j=0;j<r.data.comments.length;j++){
              var y = r.data.comments[j].createdAt.substr(0, 4);
              var m = r.data.comments[j].createdAt.substr(5, 2);
              var d = r.data.comments[j].createdAt.substr(8, 2);
              var h = r.data.comments[j].createdAt.substr(11, 2);
              var min = r.data.comments[j].createdAt.substr(14, 2);
              var s = r.data.comments[j].createdAt.substr(17, 2);
              var temp = y+'-'+m+'-'+d+' '+h+':'+min+':'+s
              r.data.comments[j].createdAt=temp
            }
            this.comments = r.data.comments
            console.log('aaaaa')
            console.log(this.comments)
          })
          .catch((e) => {
              console.error(e.message)
          })
          this.dialog2=true
      },
      openEditModal(item){
        this.form.id=item.id
        this.form.title = item.title
        this.form.content = item.content
        console.log(this.form.content)
        this.dialog2=false
        this.flag='put'
        this.dialog=true
      },
      openAddModal(){
        this.flag='post'
        this.dialog=true
      },

      saveClick (item) {
          this.form.title = this.form.title.trim()
          this.form.content = this.form.content.trim()

          if (!this.form.title || !this.form.content)
            return

          if(this.flag === 'post'){
            if(this.catagory !== ''){
              axios.post('http://192.168.0.201:3000/api/board', {
                  catagory:this.catagory,
                  title:this.form.title,
                  writer:this.user,
                  content:this.form.content,
                  views:0
              })
              .then((r) => {
                this.alertText='게시글 생성이 완료되었습니다'
                this.alert=true
              })
              .catch((e) => {
                this.alertText='에러가 발생했습니다'
                this.alert=true
                console.error(e.message)
              })
            }else{
              alert("말머리를 선택해주세요")
            }
          }
          else if(this.flag === 'put'){
            
            axios.put('http://192.168.0.201:3000/api/board', 
              { 
                id: this.form.id,
                title: this.form.title,
                content: this.form.content } 
            )
            .then((r) => {
              this.alertText='게시글 수정이 완료되었습니다'
              this.alert=true
            })
            .catch((e) => {
              this.alertText='에러가 발생했습니다'
              this.alert=true
              // alert("에러가 발생하였습니다.")
              console.error(e.message)
            })
          }
        
        
      },
      
      deletePost (item) {
        this.confirmText='정말 삭제하시겠습니까?'
        this.confirm_=true
        this.boardId=item.id
      },

      modalClose(){
        this.form.title = ''
        this.form.content = ''
        this.dialog = false
      },
      modalClose2(){
        this.form.title = ''
        this.form.content = ''
        this.comments = []
        this.dialog2 = false
      },
       modalClose3(){
       this.commentModify = ''
        this.commentDialog = false
      },
      getColor (item) {
        if (item === '공지') return 'red'
          else return 'grey'
        
      },
      setNormal(){
        this.catagory = '일반'
      },
      setNotice(){
        this.catagory = '공지'
      },
      isNew(item){
        console.log('isnew')
        var diffDate_1 = item.createdAt instanceof Date ? item.createdAt :new Date(item.createdAt);
        var diffDate_2 = new Date();
    
        diffDate_1 =new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
        diffDate_2 =new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());
    
        var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
        diff = Math.ceil(diff / (1000 * 3600 * 24));

        if(diff<3 || isNaN(diff)){
          return true
        }
        else{
          return false
        }
      },
      customSort(items, index, isDescending) {
          // The following is informations as far as I researched.
          // items: 'food' items
          // index: Enabled sort headers value. (black arrow status).
          // isDescending: Whether enabled sort headers is desc
          items.sort((a, b) => {
            console.log('sort')
            if (isDescending) {
              return b.title - a.title;
            } else {
              return a.title - b.title;
            }
          });
          return items;
      },
      alertConfirm(){
        this.alert=false
        location.href='/board'
      },
      confirmYes(item){
        axios.delete('http://192.168.0.201:3000/api/board', 
        { data: 
          { id: this.boardId } 
        })
          .then((r) => {
            location.href="/board"
          })
          .catch((e) => {
            this.alertText='에러가 발생했습니다'
            this.alert=true
            console.error(e.message)
          })
      },
      confirmNo(){
        this.confirm_=false
      },
      confirmCommentYes(){
        console.log('sdfsdf')
        console.log(this.commentId)
        axios.delete('http://192.168.0.201:3000/api/board/comment', 
        { data: 
          { id: this.commentId } 
        })
        .then((r) => {
          //여기서 커멘트 삭제
          let i=0;
          for(i=0;i<this.comments.length;i++){
            if(this.comments[i].id === this.commentId){
              this.comments.splice(i,1)
            }
          }
          this.confirmComment = false
        })
        .catch((e) => {
          this.alertText='에러가 발생했습니다'
          this.alert=true
          console.error(e.message)
        })
      },
      confirmCommentNo(){
        this.confirmComment=false
      },
    },
  components:{
    
  }
 }
</script>
<style scoped>

#board
{
  color : white
}

</style>