import { useRef, useState } from "react";
import { io } from "socket.io-client";
import "../Styles/MessageEditor.css";
import { httpClientePlugin } from "../Plugins";
const socket = io("http://localhost:3000");


const MessageEditor = ({ setMessageContainerHeight, idReciveMessague, idSentMessage }) => {
  const textAreaRef = useRef(null);
  const [actualSizaMessage, setActualSizaMessage] = useState(45); // Inicializar como número
  const [message, setMessage] = useState('');

  const adjustHeight = () => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = textarea.scrollHeight - 10;
      setMessageContainerHeight((window.innerHeight * 0.80) - actualSizaMessage);
      console.log('Altura calculada:', newHeight);

      if (newHeight <= 100) {
        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY = "hidden";
        setActualSizaMessage(newHeight); // Guardar como número
      } else {
        textarea.style.height = `180px`;
        textarea.style.overflowY = "auto";
        setActualSizaMessage(180); // Guardar como número
      }
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      try {
        await httpClientePlugin.post(idReciveMessague, idSentMessage, message);

        socket.emit('chat message', {
            idSentMessage,
          idReciveMessague,
          message,
        });
        console.log('Mensaje enviado:', idSentMessage, message);
        setMessage('');
        textAreaRef.current.style.height = '45px'; // Restablecer la altura del área de texto
      } catch (error) {
        console.error('Error al manejar el envío del mensaje:', error);
      }
    }
  };

  return (
    <div className="messageEditorContainer">
      <textarea
        ref={textAreaRef}
        className="textAreaChat"
        rows="1"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onInput={adjustHeight}
        placeholder="Escribe un mensaje..."
      ></textarea>
      <button onClick={handleSendMessage}>Enviar</button>
    </div>
  );
};

export default MessageEditor;