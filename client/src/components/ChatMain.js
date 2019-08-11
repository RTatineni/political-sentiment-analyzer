import React from "react";
import Chatkit from "@pusher/chatkit-client";
import SendMessage from './SendMessage'
import MessageView from './MessageView'
import Axios from 'axios'


class ChatMain extends React.Component {
  state = {
    currUser: {},
    currView: {},
    messages:[],
    lang: 'es',
  };


  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: "v1:us1:28eb7916-1ae3-4109-a54b-0172e85d05d6",
      userId: this.props.currUser,
      tokenProvider: new Chatkit.TokenProvider({
        url: "http://localhost:3001/api/users/authenticate"
      })
    })
    chatManager
      .connect()
      .then(currUser => {
        this.setState({ currUser })
        return currUser.subscribeToRoom({
          roomId: "901d1798-0d20-4d67-b798-6dda574e0884",
          messageLimit: 2,
          hooks: {
            onMessage: message => {
              console.log(message.text)
              Axios.get("http://localhost:3001/api/translate/"+message.text +"/"+this.state.lang, {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
              }).then(response => {
                console.log(this.state.messages)
                this.setState({
                  messages:[...this.state.messages,[response.data,message.senderId]],
                })
              })
            },
          },
        })
        
      }).then(currentRoom => {
        this.setState({ currView:currentRoom })
      })

    }

  sendMessage = (messageText) => {
    
        this.state.currUser.sendMessage({
          roomId: "901d1798-0d20-4d67-b798-6dda574e0884",
          text:messageText,
      })

    }
  
  render() {
    console.log(this.state.messages)
    return( 
        <div >
           CHAT SCREEN {this.state.currUser.id}
            <SendMessage onSubmit={this.sendMessage} />
            <MessageView messageList={this.state.messages}  />
        </div>
    );
  }
}

export default ChatMain;
