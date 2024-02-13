let users = []

const socketServer = async(io,socket) => {
  //CONNECT - DISCONECT
    socket.on("joinUser", (id) => {
        if(users.some( (u) => u.id === id )) {
           return
        }
        users.push({id, socketId: socket.id})
       
  } )

  socket.on("disconnect", () => {
    console.log("a user disconnected")
    users = users.filter( (user) => user.socketId !== socket.id )
  } )

  //LIKE
  socket.on("likePost", (newPost) => {
    const ids = [ ...newPost.user.followers, newPost.user._id ]
    const clients = users.filter( (user) => ids.includes(user.id) )
    if(clients.length > 0 ) {
        clients.forEach( (client) => {
            io.to(`${client.socketId}`).emit('likeToClient', (newPost) )
        } )
    }
  } )

    //UNLIKE
    socket.on("unLikePost", (newPost) => {
      const ids = [ ...newPost.user.followers, newPost.user._id ]
      const clients = users.filter( (user) => ids.includes(user.id) )
      if(clients.length > 0 ) {
          clients.forEach( (client) => {
              io.to(`${client.socketId}`).emit('unLikeToClient', (newPost) )
          } )
      }
    } )

       //CREATE COMMENT
       socket.on("createComment", (newPost) => {
        const ids = [ ...newPost.user.followers, newPost.user._id ]
        const clients = users.filter( (user) => ids.includes(user.id) )
        if(clients.length > 0 ) {
            clients.forEach( (client) => {
                io.to(`${client.socketId}`).emit('createCommentToClient', (newPost) )
            } )
        }
      } )

      //DELETE COMMENT
        socket.on("deleteComment", (newPost) => {
          const ids = [ ...newPost.user.followers, newPost.user._id ]
          const clients = users.filter( (user) => ids.includes(user.id) )
          if(clients.length > 0 ) {
              clients.forEach( (client) => {
                io.to(`${client.socketId}`).emit('deleteCommentToClient', (newPost) )
            } )
        }
      } )

      //FOLLOW USER
       socket.on("followUser", (newUser) => {
        const followedUser = users.find( (user) => user.id === newUser._id )
        followedUser && io.to(`${followedUser.socketId}`).emit('followUserToClient', newUser )
    } )

    //FOLLOW USER
       socket.on("unFollowUser", (newUser) => {
        const followedUser = users.find( (user) => user.id === newUser._id )
        followedUser && io.to(`${followedUser.socketId}`).emit('unFollowUserToClient', newUser )
    } )

}

module.exports = { socketServer}