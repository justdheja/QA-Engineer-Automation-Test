package examples.post;

import com.intuit.karate.junit5.Karate;

class PostRunner {
    
    @Karate.Test
    Karate testUsers() {
        return Karate.run("posts").relativeTo(getClass());
    }    

}
