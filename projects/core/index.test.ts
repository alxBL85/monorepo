import { BaseRecord, Status, validateDTO } from "."

describe("Testing projects/core/index.ts", ()=>{
    describe("Testing validation:", ()=>{
        it("should pass a valid object:", ()=> {
            const anyObject = {
                id:1,
                name: "test",
                status: Status.SUCCESS,
                payload: {
                    name: "test"
                }
            } as BaseRecord

            const validation = validateDTO(anyObject);
            expect(validation.success).toBeTruthy();
        })
    })
})