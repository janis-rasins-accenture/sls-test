export {putItem} from './dynamodb/putItem'

export const createUser = () => {
    const params = {
        TableName: process.env.TABLE_NAME_USERS,
        Item: {
            userId: "User_1",
            firstName: "Test",
            isActive: true
        }
    }
    const result = putItem(params)
    console.log(result)
}