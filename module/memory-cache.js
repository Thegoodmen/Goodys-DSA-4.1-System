export default function MemoryCache() {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##       Creates an in Memory Caching System with Max Entries avalible from everywhere         ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    let cache   = {};
    let entries = 0;
    const maxEntries = 100;
  
    function deleteEntryByKey(key) {

        // Removes an Entry from the Cache by the given key

        delete cache[key];
        if(entries > 0) entries--;
    }
  
    function deleteOldestEntry() {

        // Deletes the oldest Entry from the Cache

        let keyOfOldestItem;
        let dateOfOldestItem;

        for(let key in cache) {
            if(!dateOfOldestItem || dateOfOldestItem > cache[key].setAt) {
                dateOfOldestItem = cache[key].setAt;
                keyOfOldestItem  = key;
            }
        }
  
        if(keyOfOldestItem) deleteEntryByKey(keyOfOldestItem);
    }
  
    this.set = function(key, value) {

        if (entries >= maxEntries) deleteOldestEntry();
          
        cache[key] = {
            value:  value,
            setAt:  new Date()
        };

        console.log("Stored Object in Memory Cache with ID " + key);
  
        entries++;

        return key;
    }
  
    this.get = function(key) {

        // Get requested Entry from Cache

        let entry = cache[key];
        
        console.log("Retrived Object from Memory Cache with ID " + key);

        return (entry) ? entry.value : {};
    }

    this.generateNewId = function() {

        //generates random id;
            
        let s4 = () => { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
    
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'

        let newId =  s4() + s4() + s4() + '-' + s4();

        if(this.get(newId) != {}) newId =  s4() + s4() + s4() + '-' + s4();
    
        return newId;
    }
}