import Mock from 'mockjs'

// 是否使用mock.js模拟数据
// let useMock = true
let useMock = false;
if (useMock) {



    Mock.mock(/Journal\/JournalDetails\/getUserInformation\?id=.*/, 'get',{
        avatar_url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        name: '一个读者',
    })
  

    Mock.mock('/Journal/JournalDetails/postComments/', 'post',(options) =>{
        console.log(options.body);
        return{
            comment_id: "12345678",
            status: true,
        };
    })
   
}

export default Mock