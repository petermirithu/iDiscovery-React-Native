import { StyleSheet } from 'react-native';

export const global = StyleSheet.create({
    container: {
        flex: 1,    
        backgroundColor:"#fff"        
    }, 

    content: {
        flex: 1,
        padding: 20,                    
        width: "100%",
        height: "100%",  
        position:"relative"  
    },

    title: {
        fontSize: 25,
        textAlign: "center",                        
        textTransform: "capitalize",        
        marginBottom: 20, 
    },

    subTitle: {        
        fontSize: 20,                                
        marginBottom: 10,       
    },   

    shadowStyle:{
        shadowColor:"black",
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },   
})