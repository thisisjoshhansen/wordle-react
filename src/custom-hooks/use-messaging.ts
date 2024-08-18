import { useRef, useState } from "react";

type MessageKey = string & {_brand:'MessageKey'};
interface Message<S extends string, M extends string> {
  style: S,
  content: M,
};

interface KeyedMessage<S extends string, M extends string> extends Message<S, M> {
  key: MessageKey,
}

type TimeoutId = number & {_brand:'TimeoutId'};

export function useMessaging<S extends string, M extends string = string>(defaultDuration:number): [ messages:KeyedMessage<S,M>[], addMessage:(style: S, message: M, duration?: number)=>void ] {
  const messageTimeoutMap = useRef(new Map<MessageKey, TimeoutId>());

  const [ messages, setMessages ] = useState<KeyedMessage<S, M>[]>([]);
  
  function getMessageKey({ style, message }:{style:S, message:M}): MessageKey {
    return `style:${style} msg:${message}` as MessageKey;
  }

  function addMessage(style:S, content:M, duration=defaultDuration) {
    
    const key = getMessageKey({style, message: content});
    let alreadyHadMessage = false;

    // cancel existing
    const existingTimeout = messageTimeoutMap.current.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      alreadyHadMessage = true;
    }

    // add message
    if (!alreadyHadMessage) {
      setMessages(existing => [...existing, { style, content, key }]);
    }

    // create new timeout to remove message later
    const newTimeout = setTimeout(() => {
      messageTimeoutMap.current.delete(key);
      setMessages(existing => existing.filter(msg => msg.key !== key));
    }, duration) as TimeoutId;

    messageTimeoutMap.current.set(key, newTimeout);
  }

  return [ messages, addMessage ];
}
