import s from './view.module.styl'
import React from 'react'
import getThumbUri from '~data/modules/format/thumb'
import getScreenshotUri from '~data/modules/format/screenshot'
import getFaviconUri from '~data/modules/format/favicon'
import size from './size'
import Preloader from '~co/common/preloader'

//cache thumb/screenshot uri
const thumbs = {}
const getStellaUri = (uri, mode='', domain)=>{
    if (!thumbs[uri])
        switch (mode) {
            case 'screenshot':
                thumbs[uri] = getScreenshotUri(uri)
                break

            case 'favicon':
                thumbs[uri] = domain ? getFaviconUri(domain) : getThumbUri(uri)
                break
        
            default:
                thumbs[uri] = getThumbUri(uri)
                break
        }
    return thumbs[uri]
}

//main component
export default class BookmarkItemCover extends React.PureComponent {
    static defaultProps = {
        cover:  '',
        link:   '', //required
        view:   'list',
        indicator:false
    }

    constructor(props) {
        super(props)

        this.state = {
            loaded: props.indicator ? false : true
        }
    }

    componentDidUpdate(prev) {
        if (prev.cover != this.props.cover && this.props.indicator)
            this.setState({ loaded: false })
    }

    onImageLoadSuccess = ()=>{
        this.setState({ loaded: true })
    }

    renderImage = ()=>{
        const { cover, view, link, domain, gridSize, indicator, ...etc } = this.props
        let { width, height, ar } = size(view, gridSize) //use height only for img element
        let uri

        switch(view){
            //simple always have a favicon
            case 'simple':
                uri = getStellaUri(link, 'favicon', domain)
                break

            //in other view modes we show a thumbnail or screenshot
            default:
                uri = getStellaUri(cover, cover ? '' : 'screenshot', domain)
                break
        }

        return (
            <>
                <source
                    srcSet={`${uri}&mode=crop&format=webp&width=${width||''}&ar=${ar||''}&dpr=${window.devicePixelRatio||1} ${window.devicePixelRatio||1}x`}
                    type='image/webp' />

                <object 
                    className={s.image}
                    data-ar={ar}
                    loading='lazy'
                    width={width}
                    height={height}
                    alt=' '
                    {...etc}
                    data={`${uri}&mode=crop&width=${width||''}&ar=${ar||''}&dpr=${window.devicePixelRatio||1}`}
                    type='image/jpeg'
                    onLoad={indicator ? this.onImageLoadSuccess : undefined} />
            </>
        )
    }

    render() {
        const { className='', view } = this.props
        const { loaded } = this.state

        return (
            <picture className={s.wrap+' '+s[view]+' '+className}>
                {this.renderImage()}
                {!loaded && <div className={s.preloader}><Preloader /></div>}
            </picture>
        )
    }
}