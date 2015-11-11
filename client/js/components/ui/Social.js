import React, { Component } from 'react'
class Social extends Component {
    render() {
        let list = {
            fb: 'https://www.facebook.com/russellhobbsrussia',
            vk: 'https://vk.com/russelhobbsrussia',
            in: 'https://instagram.com/russellhobbsrussia/'
        }
        let socials = []
        for (let id in list) {
            socials.push(<a href={list[id]} key={id} target='_blank' className={`social social--${id}`}>
                <img src={`/layout/images/svg/${id}.svg`} alt='' />
            </a>)
        }
        return <div>{socials}</div>
    }
}
export default Social
