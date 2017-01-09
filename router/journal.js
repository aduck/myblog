var express=require('express')
var router=express.Router()
var marked=require('marked')
var Journal=require('../models/journal')
var moment=require('moment')
var checkLogin=require('../middle/check').checkLogin
var config=require('../config')
var upPath=config.upload
var fs=require('fs')
var url=require('url')

// 添加文章页
router.get('/create',checkLogin,function(req,res,next){
  res.render('journalCreate')
})
// 添加文章
router.post('/create',checkLogin,function(req,res,next){
  var title=req.body.title
  var thumb=req.body.thumbPath
  var tags=req.body.tags.replace(/\s+/g,' ').replace(/(^\s*)|(\s*$)/g,'').split(' ')
  var content=req.body.content
  var pictures=req.body.pictures.split(',')
  // 验证
  try{
    if(title.trim().length<1) throw new Error('标题不能为空')
    if(content.trim().length<1) throw new Error('内容不能为空')
  }catch(e){
    return res.redirect('/journal/create')
  }
  var journal=new Journal({
    title:title,
    thumb:thumb,
    tags:tags,
    content:content,
    pictures:pictures,
    author:req.session.user.nick
  })
  journal.save(function(err){
    if(err) return;
    if(req.cookies.draft) res.clearCookie('draft',{maxAge:0})
    res.redirect('/journal')
  })
})
// 查看文章
router.get('/',function(req,res,next){
  var dates=[]
  var intros=[]
  var page=req.query.page || 1
  Journal.getPage(config.page,page,function(err,journals,total){
    if(err) return next(err);
    journals.forEach(function(journal){
      dates.push(moment(journal.meta.createAt).utcOffset(8).format('DD MMM YYYY'))
      intros.push(marked(journal.content).replace(/<[^>]+>/g,'').slice(0,42))
    })
    res.locals.dates=dates
    res.locals.intros=intros
    res.render('journals',{items:journals,current:page,total:total})
  })
})
// 查看单个文章
router.get('/:id',function(req,res,next){
  var id=req.params.id
  Journal
    .findByIdAndUpdate(id,{$inc:{'meta.pv':1}})
    .exec(function(err,journal){
      if(err) return next(err);
      res.locals.html=marked(journal.content).replace(/\s+src/g," src='data:image/gif;base64,R0lGODlhGAAYAMQfANjyy+H11+355vb887HllsPrrobWXHfRR8/vvp7efP///7voo164LlOkKKjiidf1x23OOuH41fb98pTcbuz65MLwqZvmdK/rj87zunTdPIPgUmnaLrnunVvEI6bpgv///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQFBwAfACwAAAAAGAAYAAAFr+AnjuTneWVaShi5baSkkk93jU0zUo88i5vOQ9RgiCSP4U906WiAsE/kQVEhSZlO9SR6RGKjRybDOU6+Iwn6w+uNOGON7zelliKTjGU5jcxLFFVLg4QqFRYaGhYVhBR1ERSHiYuNj4KFmBJ/mCIRFxZldF6bGBYWF5spdZcRpi0iFZcfajtJPrRvqFJoXmAqDxeMHxivU7IzFxeCFcJISj8UF8/Mtal3JMS+nBFrMyEAIfkEBQcAHwAsAAAAABgAGAAABbPgJ47kRxBlWg4AeRxkoZLBsYwMMzoNMo+v1kcnQjSIv8/iMBG9nA2HahAgGQ4CE+rTgJAGI4BhIvsMEtVRwDASAABgUcFgSMR/gXeW5jBsZ3kBdyuDSYaHJAgECQkEPoYCeQABAoqMjoeRb5SInSIDhZ4CBQRlgJOFACcLCoaSex8BJ0IfcF9pH262HwqwHwgFYAJ7k1+ABY8BaXm+MwUFxEIstDOjuG9tuz++ysaeuc0pIQAh+QQFBwAfACwAAAAAFwAXAAAFgeAnjuS3LGWqjoZBIitbjMcxEgwQf5MRiDURgAHZfQoGh6i1ZBCMn4TLhPowbCPYJ5BIaD8EQWkycjAasw+i+zRCGg0liZCorgyNwxfK76cACwQECzp+H4CChIaLjIYIBYWGAQUFe30ClD8imo0BAAqNAgCciwAAA40DAGKNH6h+IQAh+QQFBwAfACwAAAAAGAATAAAFeuAnjuRXFGWaBmSSkIBaJshoGONysLLo2jjR4dAbIRIE3+szOSxUCgGJkBiYUJ9DUBQbEQjdz3PmhTBq3O9CUcwyGEmSoEDAyiYMQ7jN7/MDCCcIPEUOEA0NEA6AgoQ9hoiKfpMKbJMkAwEAjpMCAJuXIwOfUqGipiMhACH5BAUHAB8ALAAAAAAYABMAAAV24CeO5IcgZVoqJUGo8CcQwJgkY2HEoyuIN1HAMOGJAISCyCVyGJTGz+JlQn0MOJWgUAiIFNDRbLQ4HGpCrpVnMC9SiAIaljhMvNG83igIAAABP0YEBwwMBwR9f4FRhIaIe5GSkgYNB2uTEA0NDpMjDgwNYZ5WIQAh+QQFBwAfACwBAAAAFwAXAAAFg+AnjiQAkGj6CeSykIFKFrFIECOSyGNRjLdRYsf7BAoIkcuWSKYGJMTvYxIlcKPawMQSAaCt3sQwEphqxYTBMBUNAgC0imBwyBSKon7P1y8MBwcGL31KgIKEhYqLexMMBieMHwcMDFh8AWQ2EAxOfA0QJYoHDXaSCA0MkiIODZ6MbSMhACH5BAUHAB8ALAUAAAATABgAAAV+4CeOQTCe6HAiCOoOgDAWxQgQMgoA6keLAgLB9REATB+WqEAAED8BgAKKJCyeIuSpJkIkElqsiPBtiUeLxPDMbru3CYMhwT0X4vP6e79PHCZ8BgcHV2eAIguDTi4ODiIMBydhJxAQIgYMa2INDSIADJZnnCMEDItYlStsjWchACH5BAUHAB8ALAUAAAATABgAAAV+4CeOgjCeKBoEp5miADAGxQvLYlHbM/shBR/vU8ohWsPPAPcBEAjJ0+LJTBYIBVd0y90iCIkE4Rj9hsfdtFpEMDiE24TBsBsZ4J/EqDAxnCANJk8iB34vDg0HhIofEwcLLwwNZAwMIgEHjCcIDQ4jlSMLB3gfdR+ZJ1U2g0MhACH5BAUHAB8ALAEAAQAXABcAAAWA4CeOZPkNZqoKAKq+JwDAcAAI9AsE+cuLgUIB1yMhhL+iCFBAKJ/Q6AewIBAWsyfVipWuiFDEoWGALRKEkqPRgLhehETC+Sk0GI7RpCRIixByPAN0IgcMIgsLIgYJOQQMZR8GkQ4GBTQQDFkHByMGezoMfh+cIwWRL4SSqFGJNCEAIfkEBQcAHwAsAAAFABgAEwAABXTgJ45kaQ5mqgoAgKrwF7RCDM/Ba+8870CNBsSxCyAKBUTgFxwWj8lAb0o1AQyMSaxAKNRIBAbjsFsQCIARggEhjBKmxQhwJqVHBvIHKUq4R19xB1ofCXAfBAkIOwcHUh8GBm+HNwdyIpFqlDB3fZuPU3wxIQAh+QQFBwAfACwAAAUAGAATAAAFduA3IF9pnmj6FQ3jqHDqNA00xPiHHI2R5wLBb0gsEQ4MxoHwEwQAgIDgmFw2n1Fhccs1TQ4JHKBAQi0OB18OUSgETAD0wkTQmgqmQNv+NiUMNwhlBHM/BQYvHwRMKwQAPxNqHwlhH1OMOAZ4JZRwdVuLXSeCOSEAIfkECQcAHwAsAAABABcAFwAABYLgJ4pDMZ5oOiKNo74p0yBw/TnNYaPACTWCnQjBgBBIhoBQRGAwdEuegTGJWq/LheFwMCyuWq4XSy7DAg7D8QwIDE4FgyGxCwAAQZFhYhJ9TwM9IgJ3bykEdB93IgU0I4YoCAlrC38IBUo1CYkfBGsfBX0wCY6dnwGiL5l+f4NWizAhADs=' data-origin")
      res.locals.date=moment(journal.meta.createAt).utcOffset(8).format('YYYY.MM.DD HH:mm')
      // 获取上下篇
      Journal.getSiblings(id,function(err,items){
        res.render('journal',{
          journal:journal,
          siblings:items
        })
      })
    })
})
// 修改文章页
router.get('/:id/edit',checkLogin,function(req,res,next){
  var id=req.params.id
  Journal
    .findById(id)
    .exec(function(err,journal){
      if(err) return next(err)
      var tagstr=journal.tags.join(' ')
      var picstr=journal.pictures.join(',')
      res.locals.tagstr=tagstr
      res.locals.picstr=picstr
      res.render('journalEdit',journal)
    })
})
// 修改文章
router.post('/:id/edit',checkLogin,function(req,res,next){
  var id=req.params.id
  var title=req.body.title
  var thumb=req.body.thumbPath
  var tags=req.body.tags.split(' ')
  var content=req.body.content
  var pictures=req.body.pictures.split(',')
  // 验证
  try{
    if(title.trim().length<1) throw new Error('标题不能为空')
    if(content.trim().length<1) throw new Error('内容不能为空')
  }catch(e){
    return res.redirect('/journal/:id/edit')
  }
  Journal
    .update({_id:id},{$set:{
      title:title,
      thumb:thumb,
      tags:tags,
      content:content,
      pictures:pictures
    }})
    .exec(function(err){
      if(err) return;
      if(req.cookies.draft) res.clearCookie('draft',{maxAge:0})
      res.redirect('/journal')
    })
})
// 删除文章
router.get('/:id/remove',checkLogin,function(req,res,next){
  var id=req.params.id
  Journal
    .findByIdAndRemove({_id:id},function(err,journal){
      if(err) return next(err)
      try{
        var thumb=journal.thumb
        var pics=journal.pictures
        // 删除缩略图
        fs.unlinkSync('.'+url.parse(thumb).pathname)
        // 删除相关图片
        pics.forEach(function(pic){
          var img='.'+url.parse(pic).pathname
          fs.unlinkSync(img)
        })
      }catch(e){

      }
      res.redirect('/journal')
    })
})

module.exports=router