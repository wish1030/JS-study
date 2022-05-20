import Post from '../../models/post';

/*포스트 작성
POST /api/posts
{
  title : '제목',
  body:'내용,
  tags:['태그1', '태그2']
}
*/
export const write = async (ctx) => {
  const { title, body, tags } = ctx.request.body;
  //인스턴스 생성
  const post = new Post({
    title,
    body,
    tags,
  });
  try {
    //DB에 저장
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 포스트 목록 조회
GET /api/posts
*/
export const list = async (ctx) => {
  try {
    //find()로 모델 인스턴스의 데이터 조회
    //find()호출 후 exec()를 붙여줘야 서버에 쿼리를 요청함.
    const posts = await Post.find().exec();
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 특정 포스트 조회
GET /api/posts/:id
*/
export const read = async (ctx) => {
  const { id } = ctx.params;
  try {
    //특정 id를 가진 데이터 조회 : findById()
    const post = await Post.findById(id).exec();
    if (!post) {
      ctx.status = 404; //Not found
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 특정 포스트 제거
DELETE /api/posts/:id
*/
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; //No Content(성공하기는 했지만 응답할 데이터 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 포스트 수정(특정 필드 변경)
PATCH /api/posts/:id
{
  title : '제목',
  body:'내용,
  tags:['태그1', '태그2']
}
*/
export const update = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, //이 값을 설정하면 업데이트된 데이터 반환
      //false일때는 업데이트 되기 전의 데이터 반환
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
