package xml;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UnsupportedEncodingException;

/**
 * Created by yury.soukhotski on 17.07.2017.
 */
   public class test {
        public static void main(String[] args) throws IOException{

        	    StringBuffer buffer = new StringBuffer();
        	    try {
        	        FileInputStream fis = new FileInputStream("in.xml");
        	        InputStreamReader isr = new InputStreamReader(fis, "UTF8");
        	        Reader in = new BufferedReader(isr);
        	        int ch;
        	        while ((ch = in.read()) > -1) {
        	            buffer.append((char)ch);
        	        }
        	        in.close();
        	        
        	    } 
        	    catch (IOException e) {
        	        e.printStackTrace();
        	       
        	    }
        	
    	    
        		for (int i = 0; i < buffer.length(); i++){
    		        if (Integer.toHexString(buffer.charAt(i) | 0x10000).substring(1).equalsIgnoreCase("FFFD")){
    					System.out.println("i-" +i);
    					buffer.setCharAt(i, '_');
    		        	}
    			};
    			System.out.println(buffer);
      		
    			 FileOutputStream fileOuputStream = null;
				try { 
    		            fileOuputStream = new FileOutputStream("out.xml"); 
    		           fileOuputStream.write(buffer.toString().getBytes("UTF-8"));
    		        } finally {
    		         
    					fileOuputStream.close();
    		        }
    			
    			
        	};
		    
			
			
			   			
			
        }
   
