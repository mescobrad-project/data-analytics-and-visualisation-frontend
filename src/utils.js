import API from "../../axiosInstance";


export function getFileName(stepId, run_Id) {
    let fileId = "";

    API.put("function/files/",
            {
                run_id: "run_Id",
                step_id: "stepId"
            }
    ).then(res => {
        console.log("BACK_________________________")
        console.log("BACK")
        console.log(res)
    });


    return fileId;
}
