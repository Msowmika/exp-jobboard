const express = require('express');
const router = express.Router();
const jobSchema = require('../schema/job.schema')

router.post('/',async(req,res,next)=>{
    try{
        const jobInfo = req.body;
        const skills = jobInfo?.skills?.split(',') || [];
        const newSkills = skills?.map(skill=>skill?.trim());
        jobInfo.skills = newSkills;
        jobInfo.remote = jobInfo.remote === 'true'
        const user = req.user;
        jobInfo.userId = user._id;
        const job = new jobSchema(jobInfo);
        job.save().then(()=>{
            res.status(201).json(job)
        }).catch((e)=>{
            throw new Error(e.message)
        })
        res.json(job).status(200);
    }
    catch(e){
        next(e)
    }
})

router.get('/:id',async(req,res,next)=>{
    try{
        const id = req.params.id;
        const job =await jobSchema.findById(id)
        if(!job){
            return res.status(404).json({message : 'Job Not Found'})
        }
        res.json(job)
    }
    catch(e){
        next(e)
    }
})

router.delete('/:id',async(req,res,next)=>{
    try{
       const id = req.params.id;
       const job =await jobSchema.findById(id)
       if(!job){
        return res.status(404).json({message : 'Job Not Found'})
    }
    const jobCreator = job.userId.toString()
    const user = req.user._id.toString()
    if(jobCreator !== user){
        return res.status(404).json({message:'You are not authorized to delete this job'})
    }
    await jobSchema.findByIdAndDelete()
    res.status(200).json({message:'Job deleted successfully'})
    }

    catch(e){
        next(e)
    }
})

router.post('/:id',async(req,res,next)=>{
   try{
       const id = req.params.id;
       const job = await jobSchema.findById(id)
       if (!job) {
           return res.status(404).json({ message: 'Job Not Found' })
       }
       const jobCreator = job.userId.toString()
       const user = req.user._id.toString()
       if (jobCreator !== user) {
           return res.status(404).json({ message: 'You are not authorized to delete this job' })
       }
       const jobInfo = req.body;
       const skills = jobInfo?.skills?.split(',') || [];
       const newSkills = skills?.map(skill => skill?.trim());
       jobInfo.skills = newSkills;
       jobInfo.remote = jobInfo.remote === 'true';
       const updatedJob = await jobSchema.findByIdAndUpdate(id, jobInfo, {
           runValidators: true,   // run the schema validators on the updated document
           new: true  // return the updated document instead of the original
       });
       res.status(200).json(updatedJob);
   }
   catch (e) {
       next(e);
   }
});
   
router.get('/',async(req,res,next)=>{
    try{
        const { skills } = req.query;  // skills filter or keywords query
        const filter = {};
        if (skills) {
            const skillsArray = skills.split(',').map(skill => skill.trim());
            filter.skills = { $in: skillsArray };  // find jobs that have at least one of the skills in the skillsArray
        }
        // if (keywords) {
        //     filter.title = { $search: keywords };  // find jobs that have a title that contains the keywords
        // }
        const jobs = await jobSchema.find(filter);
        res.json(jobs);

    }
    catch(e){
        next(e)
    }
})

module.exports = router