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
  
    function ageOf(entry) {

        // Retrive the Age of the Entry. Calculating between now and the creation Date

        return Math.round((new Date() - entry.setAt) / 1000);
    }
  
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
  
    this.set = function(value, maxAge = 600000) {

        // Set new Entry in the Cache

        let key = entries + 1; 

        if (entries >= maxEntries) deleteOldestEntry();
          
        cache[key] = {
            value:  value,
            setAt:  new Date(),
            maxAge: maxAge};

        console.log("Stored Object in Memory Cache with ID " + key);
  
        entries++;

        return key;
    }
  
    this.get = function(key) {

        // Get requested Entry from Cache

        let entry = cache[key];
        
        console.log("Retrived Object from Memory Cache with ID " + key);

        if (entry.maxAge && entry.maxAge <= ageOf(entry)) deleteEntryByKey(key);
        return (entry) ? entry.value : {};
    }
}