<template>
    <v-dialog
      v-model="dialog"
      width="800px"
    >
      <v-card>
        <v-card-title class="#1c065a">
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
                <p class=font-weight-black > 제목 </p>
                </v-avatar>
                <v-text-field
                  placeholder="제목을 입력해주세요"
                  v-model="title"
                ></v-text-field>
              </v-row>
            </v-col>
            <v-textarea
              outlined
              name="input-7-4"
              label="내용"
              v-model="content"
              placeholder="내용을 입력해주세요."
              rows="20"
            ></v-textarea>
          </v-row>
        <v-card-actions>
          <v-card-text>
            <v-chip-group
              active-class="#1c065a"
              column
            >
              <v-chip>일반</v-chip>
              <v-chip>공지사항</v-chip>

            </v-chip-group>
          </v-card-text>
          <v-btn
            color="#1c065a"
            @click="addPost"
          >저장</v-btn>
          <v-btn
            color="#1c065a"
            @click="dialog = false"
          >취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>