function pubSub(){
    let events = {};
    
    return {
      publish: function(eventName, payload){
        if (events[eventName]){
          events[eventName].forEach(function(callback){
            callback(payload);
          })
        }
      },
  
      subscribe: function(eventName, callback){
        events[eventName] = events[eventName] || [];
        events[eventName].push(callback);
      },
  
      unsubscribe: function(eventName, callback){
        if (!events[eventName]) {
          throw new Error("event does not exist");
        }
        events[eventName].filter(function(fn){
          return fn !== callback;
        })
      },
    }
  }

export default pubSub;