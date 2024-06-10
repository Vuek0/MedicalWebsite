import { defineStore } from "pinia";

export const useUsers = defineStore('usersStore', {
    state: () => ({
        pacients: [

        ],
        doctors: [
            {
                login : 'ingizayeva',
                password: "222"
            },

            {
                login : 'kemerevo',
                password: "222"
            },

            {
                login : 'korshunov',
                password: "222"
            }
        ],
        admins: [
            {
                login : "admin",
                password: "111"
            }
        ]
    }),
    getters: {
    },
    actions: {  
        checkForUser(login, password){
            const arr = [];
            let user;
            let errors = [];
            this.pacients.forEach(item => {arr.push({...item})})
            this.doctors.forEach(item => {arr.push({...item})})
            this.admins.forEach(item => {arr.push({...item})})
            arr.forEach(item => {
                if(item.login === login && item.password === password){
                    user = item;
                } else if(item.login === login && item.password !== password){
                    errors.push("Password is incorrect");
                } else{
                    errors.push("User is not defined");
                }
            })

            if(user){
                return user;
            } else{
                
                if(login.split(" ").length > 1){
                    errors.push("You can't use the spaces");
                };
                return errors;
            }
        }
    }
});