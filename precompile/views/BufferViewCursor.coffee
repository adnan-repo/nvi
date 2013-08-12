module.exports = class BufferViewCursor
# belong to a user
# belong to a view
# cursors can also highlight and block edit
  constructor: (o) ->
    # link to cursor in buffer which holds all the information
    # incl. who the current user is
    # and what the cursor's color is
    @buffer_cursor = null
    @view = o.view
    @possessed = o.possessed or false
    @resize x: o.x, y: o.y, w: o.w, h: o.h
    return
  resize: (o) ->
    @x = o.x
    App.die "BufferViewCursor.x may not be less than 1!" if @x < 1
    @y = o.x
    App.die "BufferViewCursor.y may not be less than 1!" if @y < 1
    @w = o.w or 1
    App.die "BufferViewCursor.w may not be less than 1!" if @w < 1
    @h = o.h or 1
    App.die "BufferViewCursor.h may not be less than 1!" if @h < 1
    @draw()
    return
  draw: ->
    if @possessed
      @move 0, 0 # teleport the terminal cursor to this location
    else
      # draw a custom colored blinking cursor block ourselves
    return

  # positioning of terminal cursor relative to view
  go: (@x, @y) -> # relative to view
    App.Terminal.go(@view.x + @view.gutter.length + @x-1, @view.y + @y-1).flush()
    return
  move: (x, y=0) -> # relative to current position
    # TODO: limit cursor movement to within the typeable area, not the entire view
    dx = @x + x; dy = @y + y
    if dx >= 1 and dx <= @view.iw - @view.gutter.length and dy >= 1 and dy <= @view.ih
      @go dx, dy
    return