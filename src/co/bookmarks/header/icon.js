import s from './icon.module.styl'
import React from 'react'
import t from '~t'
import { connect } from 'react-redux'
import { selectAll } from '~data/actions/bookmarks'
import { makeStatus } from '~data/selectors/bookmarks'

import { FirstAction } from '~co/common/header'
import CollectionIcon from '~co/collections/item/icon'
import Button from '~co/common/button'
import Icon from '~co/common/icon'

class BookmarksHeaderIcon extends React.PureComponent {
    static defaultProps = {
        spaceId: 0,
        collection: {}
    }

    onSelectAllClick = ()=>{
        this.props.selectAll(this.props.spaceId)
    }

    render() {
        const { collection: { _id, cover=[], access: { level } }, status } = this.props
        const selectable = level >= 3 && status.main == 'loaded'
        const noicon = !cover.length && _id>0

        if (noicon && !selectable) return null

        return (
            <FirstAction>
                <Button 
                    className={s.button}
                    data-selectable={selectable}
                    data-no-icon={noicon}
                    title={t.s('select')+' '+t.s('all')}
                    disabled={!selectable}
                    onClick={this.onSelectAllClick}>
                    <CollectionIcon
                        className={s.icon}
                        _id={_id}
                        cover={cover}
                        loading={status.main=='loading'} />

                    {selectable && (
                        <div className={s.select}>
                            <input 
                                tabIndex='-1'
                                type='checkbox' />
                        </div>
                    )}
                </Button>
            </FirstAction>
        )
    }
}

export default connect(
	() => {
        const getStatus = makeStatus()
    
        return (state, { spaceId })=>({
            status: getStatus(state, spaceId)
        })
    },
	{ selectAll }
)(BookmarksHeaderIcon)