require_relative 'point'
require_relative 'labels'

module IDEF0
  class Line
    attr_reader :source, :target, :name
    attr_reader :source_anchor, :target_anchor

    def initialize(source, target, name)
      @source = source
      @target = target
      @name = name
      @clearance = {}
    end

    def backward?
      self.class.name =~ /::Backward.*$/
    end

    def label
      LeftAlignedLabel.new(@name, Point.new(source_anchor.x+5, source_anchor.y-5))
    end

    def bounds(bounds)
    end

    def avoid(lines, bounds_extension)
    end

    def extend_bounds(extension)
    end

    def x1
      source_anchor.x
    end

    def y1
      source_anchor.y
    end

    def x2
      target_anchor.x
    end

    def y2
      target_anchor.y
    end

    def minimum_length
      10 + Label.length(@name)
    end

    def left_edge
      [x1, x2].min
    end

    def top_edge
      [y1, y2].min
    end

    def right_edge
      [x1, x2].max
    end

    def bottom_edge
      [y1, y2].max
    end

    def sides_to_clear
      []
    end

    def clear?(side)
      sides_to_clear.include?(side)
    end

    def clearance_precedence(side)
      raise "#{self.class.name}: No clearance precedence specified for #{side.class.name}"
    end

    def anchor_precedence(side)
      clearance_precedence(side)
    end

    def clear(side, distance)
      @clearance[side] = distance
    end

    def add_clearance_from(side, distance)
      clear(side, clearance_from(side) + distance)
    end

    def clearance_from(side)
      @clearance[side] || 0
    end

    def svg_right_arrow(x,y)
      "<polygon fill='black' stroke='black' points='#{x},#{y} #{x-6},#{y+3} #{x-6},#{y-3} #{x},#{y}' />"
    end

    def svg_down_arrow(x,y)
      "<polygon fill='black' stroke='black' points='#{x},#{y} #{x-3},#{y-6} #{x+3},#{y-6} #{x},#{y}' />"
    end

    def svg_up_arrow(x,y)
      "<polygon fill='black' stroke='black' points='#{x},#{y} #{x-3},#{y+6} #{x+3},#{y+6} #{x},#{y}' />"
    end

    def svg_line(x1, y1, x2, y2)
      "<line x1='#{x1}' y1='#{y1}' x2='#{x2}' y2='#{y2}' stroke='black' />"
    end

    def svg_dashed_line(x1, y1, x2, y2)
      "<line x1='#{x1}' y1='#{y1}' x2='#{x2}' y2='#{y2}' stroke='black' stroke-dasharray='5,5' />"
    end
  end
end
